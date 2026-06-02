import os
from PIL import Image

assets_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/assets"
path = os.path.join(assets_dir, "ardennes.jpg")

if os.path.exists(path):
    img = Image.open(path)
    w, h = img.size
    print(f"Original rotated size: {w}x{h}")
    # Remove the top 256px and bottom 256px
    cropped_img = img.crop((0, 256, w, h - 256))
    cropped_img.save(path, "JPEG", quality=95)
    print(f"Cropped rotated ardennes.jpg to {cropped_img.size}")
