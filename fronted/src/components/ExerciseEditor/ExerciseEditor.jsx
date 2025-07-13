import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./ExerciseEditor.css";

/**
 * ExerciseEditor Component
 * Allows the user to edit the exercise content in a rich text editor.
 *
 * Props:
 * - initialContent: the text to initialize the editor with
 * - onContentChange: callback to notify parent about changes in the editor content (plain text)
 */
const ExerciseEditor = ({ initialContent, onContentChange }) => {
  // Holds the current state of the rich text editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  /**
   * Initialize the editor with the given content once it's available.
   */
  useEffect(() => {
    if (initialContent) {
      const contentState = ContentState.createFromText(initialContent);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [initialContent]);

  /**
   * Called whenever the user modifies the editor content.
   * Updates the local editor state and passes the plain text back to the parent.
   */
  const handleEditorChange = (state) => {
    setEditorState(state);
    // Extract plain text (without formatting) and notify the parent component
    const plainText = state.getCurrentContent().getPlainText();
    onContentChange(plainText);
  };

  return (
    <div className="exercise-editor-container">
      <h3>Edit Exercise</h3>

      {/* Rich text editor UI */}
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="editor-wrapper"
        editorClassName="editor"
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'history'],
          inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline'],
          },
        }}
      />
    </div>
  );
};

export default ExerciseEditor;

