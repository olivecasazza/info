# ⚡ Distributed Training with Ray on NixOS

We have modernized the cluster to use **Ray**. This abstracts away the manual SSH commands.

## 1. System Architecture

- **Cluster**: `services.ray-cluster` (systemd service) running on all nodes.
- **Environment**: Python `venv` at `/root/spot-training/venv`.
- **Drivers**: PyTorch + CUDA 12.1 + Nix-LD (to fix linking).

## 2. Check Cluster Status

SSH into the head node (**contra**) to check if the Ray cluster is healthy:

```bash
ssh -F ~/olivecasazza/nixlab/.ssh_config_local contra
# Check Ray status
/root/spot-training/venv/bin/ray status
```

You should see:
- **1 Head Node** (contra)
- **3 Worker Nodes** (hp01, hp02, hp03)
- **Resources**: GPU: 3.0, CPU: 96.0 (approx)

## 3. Run Training

From your laptop (this directory), run:

```bash
nix-shell shell.nix --run "python3 submit_ray_job.py"
```

This will:
1. Connect to the Ray Dashboard on `contra`.
2. Upload your training code (`train_ppo.py`, `config.yaml`, `envs/`).
3. Start the distributed job across the cluster.
4. Stream logs back to your terminal.

## 4. Troubleshooting

**"Ray binary not found"**:
- Ensure deployment finished: `just apply-by-tag hpe`.
- Ensure pip installed ray: `./setup_python_env.sh`.

**"Library not found (libstdc++)"**:
- The services are configured to auto-inject `GCC_LIB` path.
- If running manually, `export LD_LIBRARY_PATH` as shown in `test_nixos_deployment.sh`.
