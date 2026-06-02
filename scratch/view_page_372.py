with open("/Users/imwul/.gemini/antigravity-ide/brain/33f31f1c-8b19-4d70-974c-ed72242a7f96/scratch/extracted_regions.txt", "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r"=+ PAGE 372 =+.*?(?==+ PAGE \d+ =+|$)", content, re.DOTALL)
if matches:
    print(matches[0])
else:
    print("Page 372 not found!")
