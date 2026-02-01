from ray.job_submission import JobSubmissionClient
import time

# Connect to the Ray Head Node (Contra)
client = JobSubmissionClient("http://192.168.1.100:8265")

print("Submitting PPO Training Job to Ray Cluster...")

# Submit the job
job_id = client.submit_job(
    # Entrypoint command
    entrypoint="python3 train/train_rllib.py --config train/config.yaml",

    # Ensure Driver runs on Head Node to write to persistent /var/lib/ray
    entrypoint_resources={"node:192.168.1.100": 0.001},

    # Runtime environment (files to upload)
    runtime_env={
        "working_dir": "./",
        "excludes": ["venv", ".git", "__pycache__", "*.onnx", "runs", ".venv-submit"],
        # Install ALL training dependencies at runtime via pip (wheels)
        "pip": [
            "torch",
            "gymnasium",
            "pybullet",
            "scipy",
            "pandas",
            "dm-tree",
            "lz4",
            "ray[rllib,serve]",
            "requests",
            "aiohttp",
            "pillow",
        ],
        "config": {
            "setup_timeout_seconds": 3600,
        },
    }
)

print(f"✅ Job submitted! ID: {job_id}")
print(f"🔗 Dashboard: http://192.168.1.100:8265")

# Tail logs
print("\n📜 Tailing logs (Ctrl+C to stop tailing, job will continue):")
async def tail_logs():
    async for lines in client.tail_job_logs(job_id):
        print(lines, end="")

import asyncio
try:
    asyncio.run(tail_logs())
except KeyboardInterrupt:
    print(f"\nStopped tailing. Job {job_id} is still running.")
