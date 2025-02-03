import os
import sys
from difflib import SequenceMatcher


sys.stdout.reconfigure(encoding='utf-8')  # Change encoding to UTF-8 (Hebrew)


def retrieve_similar_exercises(user_exercise, base_path="database of exercises", limit=3):
    """
    Retrieves similar exercises from the database based on text similarity.

    Args:
        user_exercise (str): The exercise provided by the user.
        base_path (str): The path to the exercise database directory.
        limit (int): The maximum number of similar exercises to return.

    Returns:
        list[dict]: A list of the most similar exercises with their similarity scores.
    """
    exercises = []
    similarities = []

    # Check if the directory exists
    if not os.path.exists(base_path):
        print(f"The directory '{base_path}' does not exist.")
        return exercises

    # Iterate through all files in the directory
    for file_name in os.listdir(base_path):
        file_path = os.path.join(base_path, file_name)

        if os.path.isfile(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
                # Calculate text similarity
                similarity = SequenceMatcher(None, user_exercise, text).ratio()
                similarities.append({"file": file_path, "text": text, "similarity": similarity})

    # Sort by similarity score and return the top matches
    sorted_exercises = sorted(similarities, key=lambda x: x["similarity"], reverse=True)
    return sorted_exercises[:limit]


def build_prompt(user_exercise):
    """
    Builds a prompt for the API based on RAG (Retrieval-Augmented Generation)
    by retrieving similar exercises and integrating them.

    Args:
        user_exercise (str): The exercise provided by the user.

    Returns:
        str: The generated prompt for API usage.
    """
    similar_exercises = retrieve_similar_exercises(user_exercise)

    # Construct the prompt with similar exercises
    prompt = """
    You are a teaching assistant. Based on the provided examples,
    create a new exercise that matches the style and difficulty of the given examples.

    Examples:
    """
    for i, ex in enumerate(similar_exercises, 1):
        prompt += f"{i}. {ex['text']}\n"

    prompt += f"\nUser Exercise:\n{user_exercise}\n\nNew Exercise:\n"

    return prompt  # The function returns the prompt, the API will be triggered in main_handler
