# -*- coding: utf-8 -*-
import os

print("Merging minor_npcs.js into lore.js...")

lore_path = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/src/data/lore.js"
npcs_path = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/minor_npcs.js"

with open(lore_path, "r", encoding="utf-8") as f:
    lore_content = f.read().strip()

with open(npcs_path, "r", encoding="utf-8") as f:
    npcs_content = f.read().strip()

# Ensure there is a newline between them
combined = lore_content + "\n\n" + npcs_content

with open(lore_path, "w", encoding="utf-8") as f:
    f.write(combined)

print("Merged successfully!")

# Check syntax of lore.js using node if available or a basic check
print("Checking JS syntax...")
try:
    import jsbeautifier
    print("jsbeautifier is available, but let's just do a basic parsing check.")
except ImportError:
    pass

# We will run a command to verify using node.js
print("Running syntax check with Node...")
status = os.system("node -c \"" + lore_path + "\"")
if status == 0:
    print("Node syntax check PASSED!")
else:
    print("Node syntax check FAILED! Code is:", status)
