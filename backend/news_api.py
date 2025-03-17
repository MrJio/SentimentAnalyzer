#We will remove this from git and upload to Render when its time
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from summary_model import summarize_articles
from sentiment_model import analyze_sentiment

app = Flask(__name__)
CORS(app)
load_dotenv()

NEWS_API_KEY = os.getenv('NEWS_API_KEY')

@app.route('/api/news', methods=['GET'])
def get_news():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    url = (
        f"https://api.nytimes.com/svc/search/v2/articlesearch.json?"
        f"q={query}"
        f"&api-key={NEWS_API_KEY}"
    )
    response = requests.get(url)

    if response.status_code == 200:
        news_data = response.json()
        articles = news_data.get('response', {}).get('docs', [])

        if len(articles) < 3:
            return jsonify({"error": "Not enough relevant articles found"}), 404

        summary = summarize_articles(articles[:3])

        sentiment_result = analyze_sentiment(summary)

        return jsonify({
            "query": query,
            "summary": summary,
            "sentiment": sentiment_result
        })
    else:
        return jsonify({"error": "Failed to fetch news", "status_code": response.status_code}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)