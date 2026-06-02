import json
import re

# Read lore.js
with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/data/lore.js", "r", encoding="utf-8") as f:
    content = f.read()

# Find the cultures array
match = re.search(r'export const cultures = (\[.*?\]);', content, re.DOTALL)
if match:
    cultures_str = match.group(1)
    try:
        cultures_data = json.loads(cultures_str)
        print(f"Successfully parsed cultures array with {len(cultures_data)} items!")
        print(f"First item: {cultures_data[0]['nameKO']}")
    except Exception as e:
        print("Failed to parse cultures as direct JSON:", str(e))
else:
    print("Could not find cultures array in lore.js")
