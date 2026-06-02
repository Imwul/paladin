import fitz
import os

pdf_path = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/paladin_core_rulebook.pdf"
doc = fitz.open(pdf_path)

output_dir = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/maps"
os.makedirs(output_dir, exist_ok=True)

# Let's extract the suspected map pages:
# Book page 256 -> PDF page index 256 (0-based, page 257)
# Book page 257 -> PDF page index 257 (0-based, page 258)
# Book page 258 -> PDF page index 258 (0-based, page 259)
# Book page 259 -> PDF page index 259 (0-based, page 260)
# Book page 264 -> PDF page index 264 (0-based, page 265)
# Book page 318 -> PDF page index 318 (0-based, page 319)
# Book page 319 -> PDF page index 319 (0-based, page 320)

pages_to_extract = {
    256: "Europe_768_Left",
    257: "Europe_768_Right",
    258: "Ardennes_Left",
    259: "Ardennes_Right",
    264: "Aachen_Palace",
    318: "Europe_814_Left",
    319: "Europe_814_Right"
}

for idx, name in pages_to_extract.items():
    print(f"Extracting PDF page index {idx} ({name})...")
    try:
        page = doc[idx]
        # Use 150 DPI for good quality but reasonable file size
        pix = page.get_pixmap(dpi=150)
        output_path = os.path.join(output_dir, f"{name}.png")
        pix.save(output_path)
        print(f"Saved: {output_path} (Size: {pix.width}x{pix.height})")
    except Exception as e:
        print(f"Error on page index {idx}: {e}")

print("Extraction completed!")
