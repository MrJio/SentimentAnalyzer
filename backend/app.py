# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from transformers import pipeline

# Load environment variables
load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize models
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

# Helpers
def fetch_news(query):
    url = f"https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        articles = response.json().get("articles", [])
        return [a for a in articles if a.get("content")]
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def preprocess_articles(articles):
    processed = []
    for article in articles:
        content = article["content"].split("… [")[0]
        if len(content) > 100:
            processed.append({
                "title": article.get("title", "No Title"),
                "content": content,
                "source": article.get("source", {}).get("name", "Unknown Source")
            })
    return processed

def summarize_articles(articles, query):
    if len(articles) < 3:
        return "Not enough articles to summarize."

    # Filter relevant articles based on query
    relevant_articles = [a for a in articles if query.lower() in a["title"].lower() or query.lower() in a["content"].lower()]
    if not relevant_articles:
        relevant_articles = articles  # fallback

    # Combine title and content
    combined_text = " ".join([f"{a['title']}. {a['content']}" for a in relevant_articles[:5]])

    # Limit to ~800 words max
    if len(combined_text.split()) > 800:
        combined_text = " ".join(combined_text.split()[:800])

    # Prompt-style instruction for summarization
    combined_text = f"Summarize the key news points about '{query}':\n\n{combined_text}"

    summary = summarizer(
        combined_text,
        max_length=800,
        min_length=300,
        do_sample=False,
        clean_up_tokenization_spaces=True
    )
    return summary[0]["summary_text"]

def analyze_sentiment(text):
    result = sentiment_analyzer(text[:1000])[0]
    label_raw = result["label"]
    confidence = result["score"] * 100

    if label_raw == "POSITIVE":
        label = "Mostly Positive" if confidence >= 75 else "Somewhat Positive"
        emoji = "😃" if confidence >= 75 else "🙂"
        meter_position = 90 if confidence >= 75 else 70
    elif label_raw == "NEGATIVE":
        label = "Mostly Negative" if confidence >= 75 else "Somewhat Negative"
        emoji = "😠" if confidence >= 75 else "😕"
        meter_position = 10 if confidence >= 75 else 30
    else:
        label = "Neutral"
        emoji = "😐"
        meter_position = 50

    return {
        "sentiment": label_raw,
        "label": label,
        "emoji": emoji,
        "meterPosition": meter_position,
        "percentage": f"{confidence:.1f}",
        "confidence": "Confidence"
    }

# API route
@app.route("/api/news", methods=["GET"])
def get_news():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    articles = fetch_news(query)
    if not articles:
        return jsonify({"error": "No relevant articles found"}), 404

    processed_articles = preprocess_articles(articles)
    if not processed_articles:
        return jsonify({"error": "No valid articles for summarization"}), 404

    summary = summarize_articles(processed_articles, query)
    sentiment = analyze_sentiment(summary)

    return jsonify({
        "query": query,
        "summary": summary,
        "sentiment": sentiment
    })

# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
