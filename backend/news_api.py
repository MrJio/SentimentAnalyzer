#We will remove this from git and upload to Render when its time
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

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
        f"https://newsdata.io/api/1/news?"
        f"apikey={NEWS_API_KEY}"
        f"&q={query}"
        f"&language=en"
        f"&country=us"
    )
    response = requests.get(url)

    if response.status_code == 200:
        news_data = response.json()
        articles = news_data.get('results', [])
        if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' and request.environ.get('HTTP_USER_AGENT'):
            for index, article in enumerate(articles[:3]):
                print(f"Article {index + 1} Title: {article.get('title', 'No title available')}")
        return jsonify(news_data)
    else:
        return jsonify({"error": "Failed to fetch news", "status_code": response.status_code}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)