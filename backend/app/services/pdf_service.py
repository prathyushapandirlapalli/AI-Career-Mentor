import io
import re
import logging
from pypdf import PdfReader

logger = logging.getLogger(__name__)


class PDFExtractionError(Exception):
    """Custom exception raised when PDF parsing fails."""
    pass


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """
    Extracts and cleans text content from PDF file raw bytes.
    Uses pypdf for fast and reliable extraction with fallback regex cleaning.
    """
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted_pages = []
        
        for index, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_pages.append(text)
                
        full_text = "\n".join(extracted_pages)
        
        # Clean up whitespace and excessive line breaks
        cleaned_text = clean_resume_text(full_text)
        
        if len(cleaned_text.strip()) < 50:
            raise PDFExtractionError("Extracted text is too short or empty. Ensure PDF is text-readable and not a scanned image.")
            
        return cleaned_text
        
    except Exception as e:
        logger.error(f"Error parsing PDF document: {str(e)}")
        raise PDFExtractionError(f"Failed to extract text from PDF: {str(e)}")


def clean_resume_text(text: str) -> str:
    """
    Removes extraneous spaces, non-printable characters, and standardizes spacing.
    """
    # Replace non-breaking spaces and invalid characters
    text = text.replace('\xa0', ' ')
    # Normalize multiple newlines to max 2
    text = re.sub(r'\n\s*\n', '\n\n', text)
    # Normalize multiple horizontal spaces to single space
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()
