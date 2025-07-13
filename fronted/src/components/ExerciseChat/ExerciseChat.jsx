import React, { useState } from "react";
import axios from "axios";
import "./ExerciseChat.css";

/**
 * ExerciseChat Component
 * Allows users to interact with an AI assistant to refine or improve the generated exercise.
 * 
 * Props:
 * - topic: the selected topic for the exercise
 * - onChatResponse: callback to update the parent with the latest version of the exercise
 * - isExerciseReady: boolean to control when the chat becomes available
 */

const ExerciseChat = ({ topic, onChatResponse, isExerciseReady }) => {
  const [input, setInput] = useState("");  // Holds the current user input
  const [messages, setMessages] = useState([]);  // Chat history (user + assistant)
  const [hasStartedChat, setHasStartedChat] = useState(false); // Whether chat UI should be shown

  /**
   * Sends the user's message to the backend and handles the response.
   */
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add the user's message to the chat
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setHasStartedChat(true); // Show the chat window after first message

    try {
      // Send user input to backend server
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
        topic: topic,
      });

      // Get the AI-modified version of the exercise from the response
      const updatedExercise = response.data.new_exercise;

      // Add assistant's response to the chat
      const assistantMessage = { sender: "assistant", text: updatedExercise };
      setMessages((prev) => [...prev, assistantMessage]);

      // Notify parent component about the updated version
      if (onChatResponse) {
        onChatResponse(updatedExercise);
      }
    } catch (error) {
      console.error("Error during chat request:", error);
    }
  };

  return (
    <div className="exercise-chat-container">
      <h3>Chat for Improvements</h3>

      {/* Chat history window - only shown after user sends first message */}
      {hasStartedChat && (
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === "user" ? "user-msg" : "assistant-msg"}>
              <pre>{msg.text}</pre>
            </div>
          ))}
        </div>
      )}

      {/* Input box and send button */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for corrections or improvements..."
        />
        <button onClick={handleSend} disabled={!isExerciseReady || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ExerciseChat;
