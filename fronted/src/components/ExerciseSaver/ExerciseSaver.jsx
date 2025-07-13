import { useState } from "react";
import "./ExerciseSaver.css";

/**
 * ExerciseSaver Component
 * Allows the user to save the current exercise as a PDF or DOCX file.
 *
 * Props:
 * - contentToSave: the exercise text content to be saved
 * - topic: the topic of the exercise, used to name the file
 */
function ExerciseSaver({ contentToSave, topic }) {
  const [fileType, setFileType] = useState("pdf");  // Selected file format
  const [isSaving, setIsSaving] = useState(false);  // Indicates whether saving is in progress

  /**
   * Sends a request to the backend to generate and download the file.
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentToSave,
          file_type: fileType,
          topic: topic
        }),
      });

      // Convert the server response into a downloadable file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = topic.replace(/\s+/g, '-') + "_exercise." + fileType;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file.");
    }
    setIsSaving(false);
  };

  return (
    <div className="save-container">
      <h2 className="save-title">Save Exercise</h2>

      {/* File type selector */}
      <div className="file-type-row">
        <label htmlFor="fileType" className="file-type-label">
          File type:
        </label>
        <select
          id="fileType"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="file-type-select"
        >
          <option value="pdf">PDF</option>
          <option value="docx">DOCX</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving || !contentToSave}
        className="save-button"
      >
        {isSaving ? "Saving..." : "Save Exercise"}
      </button>
    </div>
  );
}

export default ExerciseSaver;
