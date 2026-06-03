with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

output_lines = []
for idx in range(1600, 3500):
    if idx < len(lines):
        output_lines.append(f"{idx+1}: {lines[idx].strip()}")

with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/chronicle_sections.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))
print("Done writing to chronicle_sections.txt")
