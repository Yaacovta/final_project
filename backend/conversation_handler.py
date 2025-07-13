# Global variable to store the conversation history
conversation_history = []

# Maximum number of messages allowed in the history (including the system message)
MAX_MESSAGES = 21


def initialize_conversation(topic="general"):
    """
    Initializes the conversation with a system message,
    to define the model's role.
    The system message will never be deleted.

    Args:
        topic (str): The topic for which new exercises will be generated.
            Defaults to "general".
    """
    global conversation_history
    conversation_history = [
        {
            "role": "system",
            "content": (
                "You are a creative assistant who helps generate new exercises for learning."
                " Your task is to take an example exercise provided to you,"
                " analyze its structure and complexity,"
                " and generate a new exercise on the topic '" + topic + "',"
                " keeping the same difficulty and structure."
            )
        }
    ]


def add_message(role, content):
    """
    Adds a message to the conversation history 
        and ensures a maximum of 21 messages.

    Args:
        role (str): The role of the sender ("user" or "assistant").
        content (str): The content of the message.
    """
    global conversation_history

    # Add the new message to the history
    conversation_history.append({"role": role, "content": content})

    # Manage the message limit - keep up to 21 messages
    while len(conversation_history) > MAX_MESSAGES:
        # Remove the first message that is not the system message
        if conversation_history[1]["role"] != "system":
            conversation_history.pop(1)
        else:
            break  # Do not remove the system message if it's the second message


def get_conversation_history():
    """
    Returns the current conversation history for external use

    Returns:
        list: The full conversation history.
    """
    return conversation_history
