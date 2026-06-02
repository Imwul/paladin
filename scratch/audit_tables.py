import re

# Read extracted text
with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's inspect some sections in the text
print("--- Auditing Book 1 Core Tables vs Codebase ---")

# 1. Look for Patron Saints table or text
print("\n[Audit 1: Patron Saints]")
saints_matches = re.findall(r"(St\.\s+[A-Za-z\s]+)\b", text)
print(f"Found {len(set(saints_matches))} unique Saint references in Book 1 text.")

# 2. Look for Family Characteristics
print("\n[Audit 2: Family Characteristics]")
char_matches = re.findall(r"Characteristics?\b", text, re.IGNORECASE)
print(f"Found 'Characteristic' referenced {len(char_matches)} times in Book 1.")

# 3. Search for Aging Check rules
print("\n[Audit 3: Aging Check Table]")
aging_text_matches = re.findall(r"Aging\s+Table|Table\s+\d+–\d+\s+Aging", text, re.IGNORECASE)
print(f"Aging Table references found: {aging_text_matches}")

# 4. Search for Fief Management / Harvest multipliers
print("\n[Audit 4: Harvest & Economics]")
harvest_matches = re.findall(r"Harvest\s+Roll|Table\s+\d+–\d+\s+Harvest", text, re.IGNORECASE)
print(f"Harvest references found: {harvest_matches}")

# Let's read some lines around "St. Michael" to verify the exact bonus
print("\n[Detailed Saint Search]")
for line in text.split("\n"):
    if "St. Michael" in line or "Saint Michael" in line:
        print(f"  + {line.strip()[:100]}")
        break

# Let's read some lines around "Aging"
print("\n[Detailed Aging Search]")
count = 0
for line in text.split("\n"):
    if "aging" in line.lower() and ("loss" in line.lower() or "attribute" in line.lower() or "d20" in line.lower()):
        print(f"  + {line.strip()[:100]}")
        count += 1
        if count >= 3:
            break
