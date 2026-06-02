import sys

print("Python version:", sys.version)

modules = ["fitz", "pdf2image", "pdfplumber", "pdfminer", "pypdf", "PIL"]
for mod in modules:
    try:
        __import__(mod)
        print(f"Module '{mod}' is AVAILABLE")
    except ImportError:
        print(f"Module '{mod}' is NOT available")
