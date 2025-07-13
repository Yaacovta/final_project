import { useState } from "react";
import ExerciseInput from "./components/ExerciseInput/ExerciseInput";
import ExerciseChat from "./components/ExerciseChat/ExerciseChat";
import ExerciseSaver from "./components/ExerciseSaver/ExerciseSaver";
import ExerciseResult from "./components/ExerciseResult/ExerciseResult";
import ExerciseEditor from "./components/ExerciseEditor/ExerciseEditor";
import './App.css';

function App() {
  const [initialExercise, setInitialExercise] = useState("");
  const [editableContent, setEditableContent] = useState("");
  const [topic, setTopic] = useState("");
  const [showEditor, setShowEditor] = useState(false);


  /**
   * Called when a new exercise is generated.
   * Saves both the original and editable versions, and sets the topic.
   */
  const handleExerciseGenerated = (exercise, chosenTopic) => {
    setInitialExercise(exercise);
    setEditableContent(exercise);
    setTopic(chosenTopic);
  };

  /**
   * Called when a new response is received from the chat component.
   * Updates the editable content with the AI's response.
   */
  const handleChatResponse = (response) => {
    setEditableContent(response);
  };

  return (
    <div className="App">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <ExerciseInput onExerciseGenerated={handleExerciseGenerated} /> 

        {/* תרגיל מקורי */}
        <ExerciseResult generatedExercise={initialExercise} />

        <button
          className="my-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setShowEditor(!showEditor)}
          disabled={!initialExercise}
        >
          {showEditor ? "Hide Editor" : "Edit Exercise"}
        </button>


        {showEditor && (
          <ExerciseEditor
            initialContent={editableContent}
            onContentChange={setEditableContent}
          />
        )}

        <ExerciseChat
          topic={topic}
          onChatResponse={handleChatResponse}
          isExerciseReady={!!initialExercise}
        />


        <ExerciseSaver contentToSave={editableContent} topic={topic} />
      </div>
    </div>
  );
}

export default App;
