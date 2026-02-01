import os
import trimesh

# Directories
ASSETS_DIR = "wasm/spot/assets"
GLB_DIR = "wasm/spot/assets/glb"

# Ensure output directory exists
os.makedirs(GLB_DIR, exist_ok=True)

def convert_stl_to_glb():
    # List all STL files
    files = [f for f in os.listdir(ASSETS_DIR) if f.lower().endswith(".stl")]

    print(f"Found {len(files)} STL files to convert.")

    for filename in files:
        stl_path = os.path.join(ASSETS_DIR, filename)
        glb_filename = os.path.splitext(filename)[0] + ".glb"
        glb_path = os.path.join(GLB_DIR, glb_filename)

        try:
            # Load mesh
            mesh = trimesh.load_mesh(stl_path)

            # Scale from mm to meters
            mesh.apply_scale(0.001)

            # Export to GLB (binary GLTF)
            mesh.export(glb_path, file_type='glb')

            print(f"Converted: {filename} -> {glb_filename}")
        except Exception as e:
            print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    convert_stl_to_glb()
