# from fastapi import FastAPI
# from pydantic import BaseModel
# import pickle
# import re
# from nltk.corpus import stopwords
# from nltk.stem.porter import PorterStemmer
# import nltk

# # Ensure necessary NLTK resources are downloaded
# nltk.download('stopwords')

# # Load the trained model pipeline
# with open("sentiment_pipeline.pkl", "rb") as f:
#     pipeline = pickle.load(f)

# # Initialize FastAPI app
# app = FastAPI()

# # Initialize Porter Stemmer
# port_stem = PorterStemmer()

# # Define request schema
# class TextRequest(BaseModel):
#     text: str

# def stemming(content):
#     # Define negation words
#     negation_words = {"not", "no", "never", "none", "n't"}

#     # Step 1: Remove non-alphabetic characters, preserve spaces
#     stemmed_content = re.sub('[^a-zA-Z]', ' ', content)
#     stemmed_content = stemmed_content.lower()

#     # Step 2: Tokenize the content into words
#     words = stemmed_content.split()
#     processed_words = []
#     negate = False  # Flag to handle negation

#     # Step 3: Process each word
#     for word in words:
#         if word in negation_words:
#             negate = True  # Activate negation flag
#         elif negate:
#             negated_word = f"not_{word}"  # Preserve negation context
#             processed_words.append(negated_word)
#             negate = False  # Reset negation flag
#         elif word not in stopwords.words('english'):  # Ignore regular stopwords
#             stemmed_word = port_stem.stem(word)  # Apply stemming
#             processed_words.append(stemmed_word)

#     # Step 4: Join the processed words into a single string
#     stemmed_content = ' '.join(processed_words)
#     return stemmed_content

# @app.post("/predict")
# def predict_sentiment(request: TextRequest):
#     # Preprocess text with stemming
#     processed_text = stemming(request.text)
    
#     # Make prediction using the loaded pipeline
#     prediction = pipeline.predict([processed_text])[0]
    
#     # Convert numerical output to text labels
#     sentiment = "Positive" if prediction == 1 else "Negative"
    
#     return {"sentiment": sentiment}

# # Run the server with: uvicorn ml_api:app --reload


from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Define request schema
class TextRequest(BaseModel):
    text: str

# Load the sentiment-analysis pipeline
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    framework="pt"  # force PyTorch
)

@app.post("/predict")
def predict_sentiment(request: TextRequest):
    result = sentiment_pipeline(request.text)[0]
    label = result['label']
    
    # Convert HuggingFace labels to your expected labels
    sentiment = "Positive" if label == "POSITIVE" else "Negative"
    return {"sentiment": sentiment, "confidence": round(result['score'], 4)}

# To run: uvicorn main:app --reload