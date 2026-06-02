import pypdf

reader = pypdf.PdfReader("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/paladin_core_rulebook.pdf")
print("Extracting Maps section around page 235...")

with open("/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/maps_text.txt", "w", encoding="utf-8") as f:
    # Page index is page number - 1. Page 235 is index 234. Let's extract 230-240
    for page_num in range(230, 240):
        f.write(f"\n==================== PAGE {page_num + 1} ====================\n")
        try:
            text = reader.pages[page_num].extract_text()
            f.write(text)
        except Exception as e:
            f.write(f"Error: {e}")

print("Extraction completed successfully!")
