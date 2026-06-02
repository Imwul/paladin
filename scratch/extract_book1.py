import pypdf

pdf_path = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/paladin_core_rulebook.pdf"
output_path = "/Users/imwul/Library/Mobile Documents/com~apple~CloudDocs/paladin-apo/scratch/book1_extracted.txt"

print("Initializing PdfReader...")
reader = pypdf.PdfReader(pdf_path)

print(f"Total PDF pages: {len(reader.pages)}")
print("Extracting book pages 25 to 209 (PDF index 24 to 208)...")

with open(output_path, "w", encoding="utf-8") as f:
    # Book page 25 is PDF index 24
    # Book page 209 is PDF index 208
    for page_num in range(24, 209):
        book_page_num = page_num + 1
        f.write(f"\n==================== BOOK PAGE {book_page_num} ====================\n")
        try:
            text = reader.pages[page_num].extract_text()
            if text:
                f.write(text)
            else:
                f.write("[Empty Page or Image Only]")
        except Exception as e:
            f.write(f"Error extracting page {book_page_num}: {e}")
            print(f"Error on page {book_page_num}: {e}")
            
        if book_page_num % 20 == 0 or book_page_num == 209:
            print(f"Progress: Book Page {book_page_num} extracted.")

print(f"Extraction complete! Saved to {output_path}")
