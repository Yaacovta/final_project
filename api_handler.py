from openai import OpenAI
import os

# Set the OpenAI API key using an environment variable
OpenAI.api_key = os.getenv("OPENAI_API_KEY")


def send_to_openai(conversation_history):
    """
    Sends the conversation history to the OpenAI API and returns the response.

    Args:
        conversation_history (list): The conversation history to send.

    Returns:
        str: The API's response.
    """
    user = OpenAI()
    completion = user.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation_history,
        max_tokens=300
    )
    return completion.choices[0].message.content
