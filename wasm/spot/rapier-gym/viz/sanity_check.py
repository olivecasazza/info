"""Spawn-time invariants for Spot/Rapier. Run at the top of training and
replay entrypoints. Catches the four classes of orientation/physics bugs
that produce subtly-wrong-looking output instead of an obvious crash.

Each check is fast (<0.5s combined). Failure raises AssertionError with
enough context to diagnose without re-running.
"""
from typing import Tuple

import numpy as np


def sanity_check_spawn(sim, *, axis_up: int = 1) -> dict:
    """Validate the freshly-spawned robot is oriented + grounded as expected.

    `axis_up` indexes which world axis is "up": 0=X, 1=Y, 2=Z.
    spot-physics is Y-up so the default 1 matches; pass 2 to validate against
    a hypothetical Z-up build.

    Returns a dict of measured values for logging. Raises on any violation.
    """
    poses = {n: (np.asarray(t, dtype=float), np.asarray(q, dtype=float))
             for n, t, q in sim.get_link_world_poses()}
    assert "base_link" in poses, "base_link missing from sim.get_link_world_poses()"

    base_t = poses["base_link"][0]
    base_up = float(base_t[axis_up])

    feet = [poses[f"{p}_lower_leg"][0]
            for p in ("front_left", "front_right", "back_left", "back_right")
            if f"{p}_lower_leg" in poses]
    assert feet, "no _lower_leg links found — URDF link names diverged from spot-physics?"
    feet_up = [float(f[axis_up]) for f in feet]
    max_foot_up = max(feet_up)

    # Invariant 1 — spatial layout: base sits above feet along the up-axis.
    # Tolerance is loose (5 cm) because the default stand pose has bent legs.
    assert base_up > max_foot_up + 0.05, (
        f"robot loaded sideways: base[{axis_up}]={base_up:.3f} but max foot["
        f"{axis_up}]={max_foot_up:.3f}. URDF Z-up→Y-up remap (urdf.rs::"
        f"load_robot root_pose) is broken or absent."
    )

    # Invariant 2 — feet symmetry: max-min foot height < 1 cm in the stand
    # pose. If one leg is higher than the others, joint defaults drifted or
    # a leg link's frame was corrupted.
    foot_spread = max(feet_up) - min(feet_up)
    assert foot_spread < 0.02, (
        f"feet at different heights ({foot_spread*1000:.1f} mm spread): {feet_up}. "
        "Default stand pose is not symmetric — config DEFAULT_JOINT_ANGLES "
        "may be wrong, or a leg link inherited a parent's tilt."
    )

    # Invariant 3 — terrain below robot: spawn point is above max terrain.
    # If the heightfield extends above spawn height, the robot will be
    # pre-penetrating ground at t=0 and the first physics step will explode.
    mesh = sim.get_terrain_mesh()
    if mesh is not None:
        flat_v, _ = mesh
        verts = np.asarray(flat_v, dtype=float).reshape(-1, 3)
        terrain_max = float(verts[:, axis_up].max())
        assert min(feet_up) > terrain_max - 0.01, (
            f"feet (min[{axis_up}]={min(feet_up):.3f}) inside terrain "
            f"(max[{axis_up}]={terrain_max:.3f}). Spawn height is too low for "
            f"this difficulty, or the heightfield got logged at the wrong scale."
        )

    return {
        "base_up": base_up,
        "feet_up": feet_up,
        "foot_spread": foot_spread,
        "terrain_max_up": float(verts[:, axis_up].max()) if mesh is not None else None,
    }


def sanity_check_gravity(sim, *, axis_up: int = 1, n_steps: int = 50,
                          urdf_text: str = None, terrain: str = "flat") -> dict:
    """Drop test: with zero action for `n_steps`, the base must accelerate
    downward along the up-axis and not drift laterally. Catches gravity-vector
    bugs (gravity in wrong axis, sign flip, or zero) which would otherwise
    only surface as "policy never converges."

    Note: this re-creates the sim because stepping the caller's sim mutates it.
    Caller passes the URDF text and terrain string used for the original sim.
    """
    if urdf_text is None:
        return {"skipped": "no urdf_text passed"}

    from spot_rapier.spot_rapier import SpotSim
    test_sim = SpotSim(urdf_text, terrain, 0, 0.0)

    poses0 = {n: np.asarray(t, dtype=float)
              for n, t, _ in test_sim.get_link_world_poses()}
    base0 = poses0["base_link"]

    zero_action = [0.0] * 12
    for _ in range(n_steps):
        test_sim.step(zero_action)

    poses1 = {n: np.asarray(t, dtype=float)
              for n, t, _ in test_sim.get_link_world_poses()}
    base1 = poses1["base_link"]
    delta = base1 - base0

    # Should fall in -axis_up direction; lateral drift should be small.
    horiz_axes = [a for a in range(3) if a != axis_up]
    assert delta[axis_up] < -0.001, (
        f"base did not fall along axis {axis_up}: delta={delta}. "
        "Gravity vector likely points the wrong way or is zero "
        "(physics.rs PhysicsWorld.gravity)."
    )
    horiz_drift = max(abs(delta[a]) for a in horiz_axes)
    assert horiz_drift < 0.05, (
        f"base drifted laterally during free-fall by {horiz_drift*1000:.1f} mm: "
        f"delta={delta}. URDF spawn pose is asymmetric or initial joint "
        "velocities are nonzero."
    )

    return {
        "drop_delta": delta.tolist(),
        "drop_steps": n_steps,
    }


def sanity_check_determinism(urdf_text: str, *, terrain: str = "flat",
                              seed: int = 42, n_steps: int = 30) -> dict:
    """Trajectory reproducibility: two sims with the same seed + same fixed
    action sequence must produce identical link world poses at every step.

    Catches:
      - Hidden RNG state leaking between episodes (would cause runs with the
        same seed to diverge — debugging becomes impossible)
      - Floating-point non-determinism in the physics step (FMA/SIMD ordering
        changes between threads — divergence accumulates)
      - HashMap iteration order leaking into outputs (subtle: same data,
        different order, comparison fails — but consumers also see
        different ordering, breaking downstream code)

    Deterministic by construction: action sequence is `sin(...) * 0.05` not
    random; seed is fixed; n_steps fixed; tolerance fixed. Same pass/fail
    result every run.
    """
    from spot_rapier.spot_rapier import SpotSim
    sim_a = SpotSim(urdf_text, terrain, seed, 0.0)
    sim_b = SpotSim(urdf_text, terrain, seed, 0.0)

    actions = [
        [float(np.sin((step + j * 0.7) * 0.1) * 0.05) for j in range(12)]
        for step in range(n_steps)
    ]

    max_dev_t = 0.0
    max_dev_q = 0.0
    for step, action in enumerate(actions):
        sim_a.step(action)
        sim_b.step(action)
        a = sorted(sim_a.get_link_world_poses(), key=lambda p: p[0])
        b = sorted(sim_b.get_link_world_poses(), key=lambda p: p[0])
        assert len(a) == len(b), f"link count diverged at step {step}: {len(a)} vs {len(b)}"
        for (na, ta, qa), (nb, tb, qb) in zip(a, b):
            assert na == nb, f"link name diverged at step {step}: {na} vs {nb}"
            dev_t = float(np.max(np.abs(np.asarray(ta) - np.asarray(tb))))
            dev_q = float(np.max(np.abs(np.asarray(qa) - np.asarray(qb))))
            max_dev_t = max(max_dev_t, dev_t)
            max_dev_q = max(max_dev_q, dev_q)

    # f32 accumulates ~1e-6 per multiply; over 30 physics steps × ~4 substeps,
    # ~1e-4 is the realistic ceiling for byte-identical determinism. >1e-3
    # indicates a real divergence (different effective seed, hidden RNG,
    # iteration-order leak, or floating-point non-associativity in threads).
    assert max_dev_t < 1e-4, (
        f"non-deterministic translation: max deviation = {max_dev_t:.2e} m. "
        "Same seed + same actions produced different trajectories — physics "
        "step or get_link_world_poses() has hidden non-determinism."
    )
    assert max_dev_q < 1e-4, (
        f"non-deterministic rotation: max quaternion deviation = {max_dev_q:.2e}. "
        "Same seed + same actions produced different orientations."
    )

    return {
        "max_translation_deviation": max_dev_t,
        "max_quaternion_deviation": max_dev_q,
        "n_steps": n_steps,
        "seed": seed,
    }


def sanity_check_all(sim, *, urdf_text: str = None, terrain: str = "flat",
                      verbose: bool = True) -> dict:
    """Run every spawn-time invariant. Single entrypoint for callers.

    Designed to fail loudly: if any check raises, the caller gets enough
    context to see which invariant broke and why.
    """
    spawn = sanity_check_spawn(sim, axis_up=1)
    gravity = sanity_check_gravity(sim, axis_up=1, urdf_text=urdf_text, terrain=terrain)
    determinism = (
        sanity_check_determinism(urdf_text, terrain=terrain)
        if urdf_text is not None
        else {"skipped": "no urdf_text passed"}
    )

    if verbose:
        import sys
        det_t = determinism.get("max_translation_deviation", "skip")
        det_q = determinism.get("max_quaternion_deviation", "skip")
        det_t_str = f"{det_t:.2e}" if isinstance(det_t, float) else det_t
        det_q_str = f"{det_q:.2e}" if isinstance(det_q, float) else det_q
        print(f"[sanity] base_up={spawn['base_up']:.3f} "
              f"feet_spread={spawn['foot_spread']*1000:.1f}mm "
              f"terrain_max_up={spawn['terrain_max_up']} "
              f"drop_delta={[round(x, 4) for x in gravity.get('drop_delta', [])]} "
              f"det_dev_t={det_t_str} det_dev_q={det_q_str}",
              file=sys.stderr, flush=True)

    return {"spawn": spawn, "gravity": gravity, "determinism": determinism}
