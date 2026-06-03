import fitz

doc = fitz.open("paladin_core_rulebook.pdf")
print("Total pages:", len(doc))

# We want pages 45-55. Note that PDF pages are 0-indexed.
# Let's find pages around 44-55 (which usually corresponds to PDF pages 44 to 56)
out_text = ""
for page_num in range(40, 60):
    page = doc.load_page(page_num)
    text = page.get_text()
    out_text += f"--- PDF PAGE {page_num + 1} (Rulebook Page {page_num + 1}) ---\n"
    out_text += text + "\n\n"

with open("scratch/grandfather_tables_text.txt", "w", encoding="utf-8") as f:
    f.write(out_text)

print("Extraction completed!")
