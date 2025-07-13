import { useState } from "react";
import "./ExerciseInput.css";


/**
 * ExerciseInput Component
 * Allows the user to upload a file, choose a topic and due date,
 * and submit a request to generate a new exercise.
 *
 * Props:
 * - onExerciseGenerated: callback triggered with the generated exercise and topic
 */
function ExerciseInput({ onExerciseGenerated }) {
  const [file, setFile] = useState(null);  // Holds the selected file
  const [topic, setTopic] = useState("");  // Holds the entered topic
  const [dueDate, setDueDate] = useState("");  // Holds the selected due date
  const [canSubmit, setCanSubmit] = useState(false);  // Controls submit button state

  /**
   * Handles file selection
   */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    checkIfCanSubmit(e.target.files[0], topic, dueDate);
  };

  /**
   * Handles topic input change
   */
  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    checkIfCanSubmit(file, e.target.value, dueDate);
  };

  /**
   * Handles due date input change
   */
  const handleDateChange = (e) => {
    setDueDate(e.target.value);
    checkIfCanSubmit(file, topic, e.target.value);
  };

  /**
   * Checks whether all fields are valid to enable the submit button
   */
  const checkIfCanSubmit = (f, t, d) => {
    setCanSubmit(f && t.trim() !== "" && d.trim() !== "");
  };

  /**
   * Submits the form data (file, topic, due date) to the backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", topic);
    formData.append("due_date", dueDate);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Notify parent component with the generated exercise
      onExerciseGenerated(data.generated_exercise, topic);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form className="card input-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create New Exercise</h2>

      <label className="block mb-1 font-medium">Upload File (PDF/DOCX):</label>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="mb-4 file-input"
      />

      <div className="input-row">
        <div className="input-group">
          <label className="block mb-1 font-medium">Exercise Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium">Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={handleDateChange}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-2 px-4 rounded text-white mt-4 ${
          canSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </form>
  );
}

export default ExerciseInput;
