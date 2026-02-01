
import os
from ray import serve
import subprocess
import time

# Port 16006 is within the allowed allowedTCPPortRanges (10000-65535)
TENSORBOARD_PORT = 16006
LOG_DIR = "/var/lib/ray/ray_results"

@serve.deployment(
    num_replicas=1,
    ray_actor_options={
        "num_cpus": 0,
        "resources": {"node:192.168.1.100": 0.001},
        "runtime_env": {
            "pip": ["tensorboard"]
        }
    }
)
class TensorBoardService:
    def __init__(self):
        # Ensure log directory exists
        os.makedirs(LOG_DIR, exist_ok=True)
        print(f"🚀 Starting TensorBoard on port {TENSORBOARD_PORT} watching {LOG_DIR}")

        self.process = subprocess.Popen(
            [
                "tensorboard",
                "--logdir", LOG_DIR,
                "--host", "0.0.0.0",
                "--port", str(TENSORBOARD_PORT)
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

    def check_health(self):
        if self.process.poll() is not None:
            # Process died
            raise RuntimeError("TensorBoard process died")

# Entrypoint for `serve run`
app = TensorBoardService.bind()
