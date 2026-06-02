from PIL import Image
import os

maps_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/maps"
assets_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/assets"
os.makedirs(assets_dir, exist_ok=True)

def merge_side_by_side(left_name, right_name, output_filename, crop_vertical_pct=0.0):
    left_path = os.path.join(maps_dir, f"{left_name}.png")
    right_path = os.path.join(maps_dir, f"{right_name}.png")
    
    if not os.path.exists(left_path) or not os.path.exists(right_path):
        print(f"Error: {left_path} or {right_path} does not exist.")
        return
        
    left_im = Image.open(left_path)
    right_im = Image.open(right_path)
    
    # Dimensions
    w1, h1 = left_im.size
    w2, h2 = right_im.size
    
    # Ensure they have same height
    target_height = min(h1, h2)
    left_im = left_im.resize((int(w1 * target_height / h1), target_height), Image.Resampling.LANCZOS)
    right_im = right_im.resize((int(w2 * target_height / h2), target_height), Image.Resampling.LANCZOS)
    
    w1, h1 = left_im.size
    w2, h2 = right_im.size
    
    # Create combined image
    combined_width = w1 + w2
    combined_im = Image.new("RGB", (combined_width, target_height))
    combined_im.paste(left_im, (0, 0))
    combined_im.paste(right_im, (w1, 0))
    
    # Optionally crop top/bottom headers/footers (like page numbers)
    # If crop_vertical_pct > 0, crop that percentage from top and bottom
    if crop_vertical_pct > 0:
        crop_h = int(target_height * crop_vertical_pct)
        combined_im = combined_im.crop((0, crop_h, combined_width, target_height - crop_h))
        
    # Resize to web-friendly resolution (e.g. max width 1600px)
    final_width = 1600
    final_height = int(combined_im.height * final_width / combined_im.width)
    optimized_im = combined_im.resize((final_width, final_height), Image.Resampling.LANCZOS)
    
    output_path = os.path.join(assets_dir, output_filename)
    # Save as optimized JPEG to keep size small but quality high
    optimized_im.save(output_path, "JPEG", quality=85)
    print(f"Merged and optimized: {output_path} ({final_width}x{final_height})")

def copy_single_page(name, output_filename, crop_vertical_pct=0.0):
    src_path = os.path.join(maps_dir, f"{name}.png")
    if not os.path.exists(src_path):
        print(f"Error: {src_path} does not exist.")
        return
        
    im = Image.open(src_path)
    w, h = im.size
    
    if crop_vertical_pct > 0:
        crop_h = int(h * crop_vertical_pct)
        im = im.crop((0, crop_h, w, h - crop_h))
        
    # Resize to web-friendly (max width 1000px)
    final_width = 1000
    final_height = int(im.height * final_width / im.width)
    optimized_im = im.resize((final_width, final_height), Image.Resampling.LANCZOS)
    
    output_path = os.path.join(assets_dir, output_filename)
    optimized_im.save(output_path, "JPEG", quality=85)
    print(f"Optimized single page: {output_path} ({final_width}x{final_height})")

# Merge the 3 split maps (with 6% top/bottom crop to remove headers/footers)
merge_side_by_side("Europe_768_Left", "Europe_768_Right", "europe_768.jpg", crop_vertical_pct=0.05)
merge_side_by_side("Ardennes_Left", "Ardennes_Right", "ardennes.jpg", crop_vertical_pct=0.05)
merge_side_by_side("Europe_814_Left", "Europe_814_Right", "europe_814.jpg", crop_vertical_pct=0.05)

# Aachen single page (with 5% top/bottom crop)
copy_single_page("Aachen_Palace", "aachen.jpg", crop_vertical_pct=0.05)

print("Map merging and optimization completed!")
