import fitz  # PyMuPDF
from io import BytesIO
import re

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

def extract_pdf_preview(file_bytes: bytes) -> dict:
    """Extract all data from PDF for display."""
    pages_data = []
    full_text = ""
    total_pages = 0
    
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        total_pages = len(doc)
        for page_num, page in enumerate(doc, 1):
            page_text = page.get_text()
            full_text += page_text + "\n"
            
            # Extract tables if any (text blocks that look like tables)
            blocks = page.get_text("blocks")
            
            pages_data.append({
                "page_number": page_num,
                "text": page_text.strip(),
                "word_count": len(page_text.split())
            })
    
    # Parse structured data - look for key-value pairs
    extracted_data = []
    lines = full_text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Look for patterns like "Key: Value" or "Key - Value"
        if ':' in line:
            parts = line.split(':', 1)
            if len(parts) == 2 and len(parts[0]) < 50:
                extracted_data.append({
                    "field": parts[0].strip(),
                    "value": parts[1].strip()
                })
        elif ' - ' in line and len(line) < 200:
            parts = line.split(' - ', 1)
            if len(parts) == 2:
                extracted_data.append({
                    "field": parts[0].strip(),
                    "value": parts[1].strip()
                })
    
    # Extract numeric data with context
    numeric_data = []
    for line in lines:
        # Find lines with numbers
        numbers = re.findall(r'(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(tons?|tonnes?|kg|MT|kWh|MWh|GWh|liters?|L|gallons?|%|million|billion|crore|lakh|Rs\.?|₹|\$|USD|INR)?', line, re.IGNORECASE)
        if numbers and len(line) < 300:
            for num, unit in numbers:
                numeric_data.append({
                    "value": num,
                    "unit": unit or "",
                    "context": line.strip()[:150]
                })
    
    # Extract certifications
    certifications = []
    cert_patterns = ['ISO 14001', 'ISO 9001', 'ISO 45001', 'ISO 50001', 'B-Corp', 'SBTi', 'GRI', 'CDP', 'LEED', 'FSC', 'OHSAS']
    for cert in cert_patterns:
        if cert.lower() in full_text.lower():
            certifications.append(cert)
    
    # Extract years
    years = list(set(re.findall(r'\b(20[1-2]\d)\b', full_text)))
    years.sort(reverse=True)
    
    # Try to extract company name
    company_name = extract_company_name(full_text)
    
    return {
        "company_name": company_name,
        "total_pages": total_pages,
        "total_words": len(full_text.split()),
        "full_text": full_text.strip(),
        "pages": pages_data,
        "extracted_fields": extracted_data[:50],  # Limit to 50 fields
        "numeric_data": numeric_data[:30],  # Limit to 30 numeric entries
        "certifications": certifications,
        "years_mentioned": years[:10],
    }
