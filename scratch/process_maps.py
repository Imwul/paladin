import os
from PIL import Image

assets_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/assets"

# 1. Rotate ardennes.jpg 90 degrees clockwise
ardennes_path = os.path.join(assets_dir, "ardennes.jpg")
if os.path.exists(ardennes_path):
    img = Image.open(ardennes_path)
    # Rotate 90 degrees clockwise
    rotated_img = img.rotate(270, expand=True) # 270 degrees counter-clockwise is 90 degrees clockwise
    rotated_img.save(ardennes_path, "JPEG", quality=95)
    print(f"Rotated ardennes.jpg to {rotated_img.size}")

# 2. Crop europe_768.jpg and europe_814.jpg
for fname in ["europe_768.jpg", "europe_814.jpg"]:
    path = os.path.join(assets_dir, fname)
    if os.path.exists(path):
        img = Image.open(path)
        # Crop 256 pixels from left and right
        # Crop box: (left, upper, right, lower)
        cropped_img = img.crop((256, 0, 1600 - 256, 932))
        cropped_img.save(path, "JPEG", quality=95)
        print(f"Cropped {fname} to {cropped_img.size}")
