import os
from PIL import Image

assets_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/assets"

for fname in ["ardennes.jpg", "europe_768.jpg", "europe_814.jpg"]:
    path = os.path.join(assets_dir, fname)
    if os.path.exists(path):
        img = Image.open(path)
        print(f"{fname}: {img.size} {img.format}")
    else:
        print(f"{fname} not found at {path}")
