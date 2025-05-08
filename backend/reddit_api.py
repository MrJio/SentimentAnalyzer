# backend/reddit_api.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from transformers import pipeline

app = Flask(__name__)
CORS(app)
load_dotenv()

# Load environment variables
REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT')

# Load sentiment model
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")

def classify_sentiment(text):
    try:
        result = sentiment_analyzer(text[:1000])[0]
        label = result['label']
        score = result['score']

        # Custom threshold for 'neutral' classification
        if score < 0.6:
            return 'neutral'
        elif label == 'POSITIVE':
            return 'positive'
        else:
            return 'negative'
    except Exception as e:
        print(f"Error analyzing sentiment: {e}")
        return 'neutral'

@app.route('/api/reddit', methods=['GET'])
def get_reddit_posts():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    # Step 1: Authenticate with Reddit API
    auth_url = "https://www.reddit.com/api/v1/access_token"
    auth_data = { 'grant_type': 'client_credentials' }
    auth_headers = { 'User-Agent': REDDIT_USER_AGENT }

    auth_response = requests.post(
        auth_url,
        data=auth_data,
        headers=auth_headers,
        auth=(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET)
    )

    if auth_response.status_code != 200:
        return jsonify({"error": "Failed to authenticate with Reddit API", "status_code": auth_response.status_code}), 500

    access_token = auth_response.json().get('access_token')

    # Step 2: Search Reddit posts (paginate up to ~100 posts)
    search_url = "https://oauth.reddit.com/search"
    search_headers = {
        'Authorization': f'Bearer {access_token}',
        'User-Agent': REDDIT_USER_AGENT
    }

    all_posts = []
    after = None
    max_posts = 100

    while len(all_posts) < max_posts:
        limit = min(25, max_posts - len(all_posts))
        search_params = {
            'q': query,
            'limit': limit,
            'sort': 'relevance',
            'after': after
        }

        response = requests.get(search_url, params=search_params, headers=search_headers)
        if response.status_code != 200:
            break

        data = response.json()
        posts = data.get('data', {}).get('children', [])
        if not posts:
            break

        all_posts.extend(posts)
        after = data.get('data', {}).get('after')
        if not after:
            break

    sentiment_counts = { 'positive': 0, 'neutral': 0, 'negative': 0 }

    for post in all_posts:
        title = post.get('data', {}).get('title', '')
        sentiment = classify_sentiment(title)
        sentiment_counts[sentiment] += 1

    return jsonify({
        "query": query,
        "sentiments": sentiment_counts
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
