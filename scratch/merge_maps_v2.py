from PIL import Image
import os

maps_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/maps"
assets_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/assets"
os.makedirs(assets_dir, exist_ok=True)

def process_europe_map(left_name, right_name, output_filename):
    left_path = os.path.join(maps_dir, f"{left_name}.png")
    right_path = os.path.join(maps_dir, f"{right_name}.png")
    
    if not os.path.exists(left_path) or not os.path.exists(right_path):
        print(f"Error: {left_path} or {right_path} does not exist.")
        return
        
    left_im = Image.open(left_path)
    right_im = Image.open(right_path)
    
    w1, h1 = left_im.size
    w2, h2 = right_im.size
    
    # Crop Europe Map:
    # Outer red borders are about 190 pixels wide on the left of left page and right of right page.
    # Also crop top/bottom headers (about 80 pixels from top, 80 pixels from bottom).
    crop_border_w = 188
    crop_header_h = 80
    
    # Left page: crop out left red border and top/bottom header
    left_cropped = left_im.crop((crop_border_w, crop_header_h, w1, h1 - crop_header_h))
    # Right page: crop out right red border and top/bottom header
    right_cropped = right_im.crop((0, crop_header_h, w2 - crop_border_w, h2 - crop_header_h))
    
    # Dimensions after crop
    wc1, hc1 = left_cropped.size
    wc2, hc2 = right_cropped.size
    
    # Merge side-by-side
    combined_width = wc1 + wc2
    target_height = min(hc1, hc2)
    
    left_cropped = left_cropped.resize((wc1, target_height), Image.Resampling.LANCZOS)
    right_cropped = right_cropped.resize((wc2, target_height), Image.Resampling.LANCZOS)
    
    combined_im = Image.new("RGB", (combined_width, target_height))
    combined_im.paste(left_cropped, (0, 0))
    combined_im.paste(right_cropped, (wc1, 0))
    
    # Resize to web-friendly resolution (width 1600px)
    final_width = 1600
    final_height = int(combined_im.height * final_width / combined_im.width)
    optimized_im = combined_im.resize((final_width, final_height), Image.Resampling.LANCZOS)
    
    output_path = os.path.join(assets_dir, output_filename)
    optimized_im.save(output_path, "JPEG", quality=90)
    print(f"Europe map processed and saved to: {output_path} ({final_width}x{final_height})")

def process_ardennes_map(left_name, right_name, output_filename):
    left_path = os.path.join(maps_dir, f"{left_name}.png")
    right_path = os.path.join(maps_dir, f"{right_name}.png")
    
    if not os.path.exists(left_path) or not os.path.exists(right_path):
        print(f"Error: {left_path} or {right_path} does not exist.")
        return
        
    left_im = Image.open(left_path)
    right_im = Image.open(right_path)
    
    w1, h1 = left_im.size
    w2, h2 = right_im.size
    
    # For Ardennes:
    # Since it is printed sideways in the PDF, when split side-by-side, the red borders are actually at the top and bottom!
    # Let's crop out the red borders (about 188 pixels from the left of left page and right of right page) and headers.
    crop_border_w = 188
    crop_header_h = 80
    
    left_cropped = left_im.crop((crop_border_w, crop_header_h, w1, h1 - crop_header_h))
    right_cropped = right_im.crop((0, crop_header_h, w2 - crop_border_w, h2 - crop_header_h))
    
    wc1, hc1 = left_cropped.size
    wc2, hc2 = right_cropped.size
    
    combined_width = wc1 + wc2
    target_height = min(hc1, hc2)
    
    left_cropped = left_cropped.resize((wc1, target_height), Image.Resampling.LANCZOS)
    right_cropped = right_cropped.resize((wc2, target_height), Image.Resampling.LANCZOS)
    
    combined_im = Image.new("RGB", (combined_width, target_height))
    combined_im.paste(left_cropped, (0, 0))
    combined_im.paste(right_cropped, (wc1, 0))
    
    # Rotate 90 degrees clockwise to make it upright!
    rotated_im = combined_im.rotate(270, expand=True) # 270 degrees clockwise or 90 degrees clockwise?
    # Wait: PIL rotate is counter-clockwise. To rotate 90 degrees clockwise, we use 270 (or Image.ROTATE_270).
    # Let's use Image.ROTATE_270 to rotate 90 degrees clockwise.
    rotated_im = combined_im.transpose(Image.Transpose.ROTATE_270)
    
    # Resize to web-friendly resolution (max width 1200px or height 1600px)
    final_width = 1200
    final_height = int(rotated_im.height * final_width / rotated_im.width)
    optimized_im = rotated_im.resize((final_width, final_height), Image.Resampling.LANCZOS)
    
    output_path = os.path.join(assets_dir, output_filename)
    optimized_im.save(output_path, "JPEG", quality=90)
    print(f"Ardennes map rotated and saved to: {output_path} ({final_width}x{final_height})")

def process_aachen_map(name, output_filename):
    src_path = os.path.join(maps_dir, f"{name}.png")
    if not os.path.exists(src_path):
        print(f"Error: {src_path} does not exist.")
        return
        
    im = Image.open(src_path)
    w, h = im.size
    
    # Crop borders (about 80 pixels all around to clean up)
    im_cropped = im.crop((80, 80, w - 80, h - 80))
    
    final_width = 1000
    final_height = int(im_cropped.height * final_width / im_cropped.width)
    optimized_im = im_cropped.resize((final_width, final_height), Image.Resampling.LANCZOS)
    
    output_path = os.path.join(assets_dir, output_filename)
    optimized_im.save(output_path, "JPEG", quality=90)
    print(f"Aachen map saved to: {output_path} ({final_width}x{final_height})")

# Process maps
process_europe_map("Europe_768_Left", "Europe_768_Right", "europe_768.jpg")
process_europe_map("Europe_814_Left", "Europe_814_Right", "europe_814.jpg")
process_ardennes_map("Ardennes_Left", "Ardennes_Right", "ardennes.jpg")
process_aachen_map("Aachen_Palace", "aachen.jpg")

print("All maps cropped, rotated, and optimized successfully!")
