with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")

def print_section(keyword, count_lines=30):
    print(f"\n==================== SEARCH: {keyword} ====================")
    found = False
    for i, line in enumerate(lines):
        if keyword.lower() in line.lower():
            start = max(0, i - 2)
            end = min(len(lines), i + count_lines)
            print("\n".join(lines[start:end]))
            print("-" * 50)
            found = True
            break
    if not found:
        print("Not found.")

# Let's search for the St. Saint table
print_section("1 St. Denis", 25)
print_section("Table 1–4", 25)
print_section("Table 10–1", 25)
print_section("Table 10-1", 25)
print_section("Table 12–", 25)
