"""Rerun-based visualization for Spot quadruped training.

Requires rerun-sdk (pip install rerun-sdk). This package runs on the
visualization host (seir), not on the training nodes themselves.

Modules:
    rerun_logger -- RLlib callback that streams per-step env state to Rerun
    dashboard    -- Standalone dashboard reading Ray progress.csv from nodes
"""

try:
    import rerun  # noqa: F401

    RERUN_AVAILABLE = True
except ImportError:
    RERUN_AVAILABLE = False

if not RERUN_AVAILABLE:
    import warnings

    warnings.warn(
        "rerun-sdk not installed. Install with: pip install rerun-sdk\n"
        "Visualization modules will not be functional.",
        ImportWarning,
        stacklevel=2,
    )
