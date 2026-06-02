with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")

print("--- Searching for Father's Class Table ---")
for i, line in enumerate(lines[:3000]):
    if "father's class" in line.lower() or "father’s class" in line.lower():
        if "table" in line.lower() or "d20" in line.lower() or "glory" in line.lower() or "points" in line.lower():
            start = max(0, i - 2)
            end = min(len(lines), i + 20)
            print(f"Index {i}:")
            print("\n".join(lines[start:end]))
            print("="*60)
            break
            
# Let's also do a general search for "Bachelor" in the first 1000 lines
print("\n--- Searching for Bachelor in Book 1 ---")
for i, line in enumerate(lines[:2000]):
    if "bachelor" in line.lower():
        start = max(0, i - 5)
        end = min(len(lines), i + 20)
        print(f"Index {i}:")
        print("\n".join(lines[start:end]))
        print("="*60)
        break
