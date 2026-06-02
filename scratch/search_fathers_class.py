with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")

print("--- Searching for Father's Class Table ---")
for i, line in enumerate(lines):
    if "banneret" in line.lower() and "bachelor" in line.lower():
        start = max(0, i - 5)
        end = min(len(lines), i + 20)
        print(f"Index {i}:")
        print("\n".join(lines[start:end]))
        print("="*60)
        break
