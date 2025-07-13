from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from main_handler import create_exercise, continue_conversation


app = Flask(__name__)
CORS(app)  # Allows React frontend to make requests to this server


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  


@app.route("/upload", methods=["POST"])
def upload_file():
    """
    Handles file upload and exercise generation.
    Expects: file, topic, due_date (as form-data)
    Returns: generated exercise as JSON
    """
    uploaded_file = request.files.get("file")
    topic = request.form.get("topic")
    due_date = request.form.get("due_date")

    if not uploaded_file or not topic:
        return jsonify({"error": "Missing file or topic"}), 400

    # Save the uploaded file securely
    filename = secure_filename(uploaded_file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    uploaded_file.save(file_path)

    try:
        # Generate a new exercise using the uploaded file and topic
        generated_exercise = create_exercise(file_path, topic, due_date)
    except Exception as e:
        return jsonify({"error": f"Failed to generate exercise: {str(e)}"}), 500

    return jsonify({"generated_exercise": generated_exercise})


@app.route("/chat", methods=["POST"])
def chat():
    """
    Handles user message for AI conversation and returns updated exercise.
    Expects: JSON with 'message' and 'topic'
    Returns: modified exercise content
    """
    user_message = request.json.get("message")
    topic = request.json.get("topic")

    if not user_message or not topic:
        return jsonify({"error": "Missing input"}), 400

    try:
        response = continue_conversation(user_message, topic)
        return jsonify({"new_exercise": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/save", methods=["POST"])
def save_file():
    """
    Saves the exercise content as a file (PDF or DOCX) 
        and returns it for download.
    Expects: JSON with 'content', 'file_type'
    Returns: downloadable file
    """
    data = request.get_json()
    content = data.get("content", "")
    file_type = data.get("file_type", "").lower()

    topic = "exercise"
    if not content or file_type not in ("pdf", "docx"):
        return jsonify({"error": "Invalid input"}), 400

    file_type_code = "P" if file_type == "pdf" else "D"

    # Save to a temporary directory
    saved_dir = os.path.join("static", "saved_files")
    os.makedirs(saved_dir, exist_ok=True)

    filename = f"{topic}_exercise.{file_type}"
    filepath = os.path.join(saved_dir, filename)

    try:
        from file_processor import file_type_of_the_new_exercise
        file_type_of_the_new_exercise(content, os.path.join(saved_dir, f"{topic}_exercise"), file_type_code)

        # Return the file directly for download
        return send_file(filepath, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run the Flask development server
    app.run(debug=True, port=5000)
