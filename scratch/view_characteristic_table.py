with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")

print("--- Searching for Horsemanship / Saddle ---")
for i, line in enumerate(lines):
    if "saddle" in line.lower() or "otters" in line.lower():
        start = max(0, i - 10)
        end = min(len(lines), i + 25)
        print(f"Index {i}:")
        print("\n".join(lines[start:end]))
        print("="*60)
        break
