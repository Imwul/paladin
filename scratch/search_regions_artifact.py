with open("/Users/imwul/.gemini/antigravity-ide/brain/33f31f1c-8b19-4d70-974c-ed72242a7f96/scratch/extracted_regions.txt", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r"=+ PAGE \d+ =+.*?(?==+ PAGE \d+ =+|$)", content, re.DOTALL)
print(f"Total parsed pages in extracted_regions.txt: {len(matches)}")

for part in matches:
    if "PAGE 371" in part or "PAGE 372" in part or "Ethiopia" in part or "Cathay" in part:
        lines = part.split("\n")
        print(f"\nFound match in page block: {lines[0]}")
        print("\n".join(lines[:30]))
