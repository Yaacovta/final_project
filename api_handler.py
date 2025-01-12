from openai import OpenAI
import os

# Set the OpenAI API key using an environment variable
OpenAI.api_key = os.getenv("OPENAI_API_KEY")

prompt = "Give me a single factual statement about AI."
user = OpenAI()

# Create a chat completion request to the OpenAI API
completion = user.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": prompt
        }
    ],
    max_tokens=15
)

print("Response: ", completion.choices[0].message.content)
# print("Num of tokens: ", completion.usage.total_tokens)
