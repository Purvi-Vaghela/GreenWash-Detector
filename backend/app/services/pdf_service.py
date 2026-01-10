import fitz  # PyMuPDF
from io import BytesIO

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    text_content = []
    
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text_content.append(page.get_text())
    
    return "\n".join(text_content)

def extract_company_name(text: str) -> str:
    """Try to extract company name from the first few lines of the PDF."""
    lines = text.strip().split('\n')[:20]
    
    # Look for common patterns
    for line in lines:
        line = line.strip()
        if len(line) > 3 and len(line) < 100:
            # Skip common headers
            skip_words = ['sustainability', 'report', 'annual', 'environmental', 'esg']
            if not any(word in line.lower() for word in skip_words):
                return line
    
    return "Unknown Company"
