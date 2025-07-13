import React from "react";
import "./ExerciseResult.css";

/**
 * ExerciseResult Component
 * Displays the generated exercise in a styled container.
 *
 * Props:
 * - generatedExercise: the exercise text received from the backend or generated via chat
 */
function ExerciseResult({ generatedExercise }) {
  // If there's no exercise to display, render nothing
  if (!generatedExercise) return null;

  return (
    <div className="exercise-card">
      <h3 className="exercise-heading">Generated Exercise</h3>

      {/* Display the exercise content using <pre> to preserve formatting */}
      <div className="exercise-content">
        <pre className="exercise-description">{generatedExercise}</pre>
      </div>
    </div>
  );
}

export default ExerciseResult;
