import PyPDF2
from docx import Document
import sys


def extract_text_from_pdf(file_path):
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)  # Create a PDF reader object
            text = ""
            for page in reader.pages:  # Iterate over all pages in the PDF
                extracted = page.extract_text()
                if extracted:  # Check if the page contains any text
                    text += extracted
            return text
    except Exception as e:  # Handle errors during reading
        print(f"An error occurred while reading the text from the PDF: {e}")
        return None


def extract_text_from_docx(file_path):
    try:
        doc = Document(file_path)  # Open the DOCX file
        text = [paragraph.text for paragraph in doc.paragraphs]
        return "\n".join(text)
    except Exception as e:
        print(f"An error occurred while reading the text from the DOCX: {e}")
        return None


def extract_text(file_path):
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    if file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)


ex = extract_text("examm.pdf")
# print(ex)

ex2 = extract_text("examm2.docx")
# print(ex2)

sys.stdout.reconfigure(encoding='utf-8')  # שינוי הקידוד ל-UTF-8
