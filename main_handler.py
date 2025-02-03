# import file_processor
from file_processor import extract_text, file_type_of_the_new_exercise
from api_handler import send_to_openai
from conversation_handler import initialize_conversation, add_message, get_conversation_history

import sys

# Enable UTF-8 encoding for Hebrew support
sys.stdout.reconfigure(encoding='utf-8')

# Extract text from the input file
file_path = "examm2.docx"
text_of_the_exercise = extract_text(file_path)
topic = "strings"

# Initialize the conversation with the specified topic
initialize_conversation(topic)

# Add the user's exercise to the conversation
add_message("user", f"Topic: {topic}\n\n{text_of_the_exercise}")


# Main conversation loop
while True:

    conversation_history = get_conversation_history()  # Retrieve the conversation history
    new_exercise = send_to_openai(conversation_history)  # Send the entire conversation to the API

    # Save the exercise as a text file
    new_txt_file = f"{topic}_exercise.txt"
    with open(new_txt_file, "w", encoding="utf-8") as file:
        file.write(new_exercise)

    print("Assistant's Response --- \n", new_exercise)

    # Add the assistant's response to the conversation history
    add_message("assistant", new_exercise)

    # Get user input
    user_input = input("Your response (type 'exit' to end): ")

    if user_input.lower() == "exit":
        print("Ending the conversation.")
        break

    # Add the user's input to the conversation history
    add_message("user", user_input)


name_of_new_exercise = f"{topic}_exercise"  # Save the new exercise
type_of_file_created = input("Choose file type ('P' for PDF, 'D' for DOCX): ")  # File type selection

"""
# Save the exercise as a text file
new_txt_file = f"{topic}_exercise.txt"
with open(new_txt_file, "w", encoding="utf-8") as file:
    file.write(new_exercise)
"""

"""
try:
    file_type_of_the_new_exercise(new_exercise, name_of_new_exercise, type_of_file_created)
except ValueError as e:
    print(f"Error saving file: {e}")
"""
