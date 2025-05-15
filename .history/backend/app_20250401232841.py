from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import fitz  # PyMuPDF for PDF text extraction
import docx  # python-docx for DOCX text extraction

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath):
    text = ""
    with fitz.open(filepath) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

def extract_text_from_docx(filepath):
    doc = docx.Document(filepath)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Extract text based on file type
        if filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(filepath)
        elif filename.endswith('.docx'):
            extracted_text = extract_text_from_docx(filepath)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        # Mock structured data (you can replace this with actual parsing logic)
        structured_data = {
            "personalInfo": {
                "name": "Max Mustermann",
                "email": "max@example.com",
                "phone": "123456789",
                "address": "Musterstraße 1, 12345 Musterstadt"
            },
            "education": [
                {"degree": "Bachelor of Science", "institution": "Muster University", "location": "Musterstadt", "dates": "2015-2018"}
            ],
            "experience": [
                {"title": "Software Engineer", "company": "TechCorp", "location": "Berlin", "dates": "2019-2023", "responsibilities": ["Developed web applications", "Collaborated with cross-functional teams"]}
            ],
            "skills": ["Python", "JavaScript", "Flask", "React"]
        }

        return jsonify({"message": "File uploaded successfully", "data": structured_data}), 200

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)