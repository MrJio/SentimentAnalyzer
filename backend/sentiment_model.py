#We will remove this from git and upload to Render when its time
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

def analyze_sentiment(text):
    sentiment_result = sentiment_analyzer(text[:1000])
    sentiment = sentiment_result[0]['label']
    confidence = sentiment_result[0]['score'] * 100

    return {
        "sentiment": sentiment,
        "percentage": f"{confidence:.1f}%",
        "confidence": f"Confidence"
    }
