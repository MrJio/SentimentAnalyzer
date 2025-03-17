# We will remove this from git and upload to Render when its time
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

REDDIT_CLIENT_ID = os.getenv('REDDIT_CLIENT_ID')
REDDIT_CLIENT_SECRET = os.getenv('REDDIT_CLIENT_SECRET')
REDDIT_USER_AGENT = os.getenv('REDDIT_USER_AGENT')

@app.route('/api/reddit', methods=['GET'])
def get_reddit_posts():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing search query"}), 400

    # Reddit API requires OAuth2 for most endpoints, so we'll use the OAuth2 flow
    # First, get an access token
    auth_url = "https://www.reddit.com/api/v1/access_token"
    auth_data = {
        'grant_type': 'client_credentials'
    }
    auth_headers = {
        'User-Agent': REDDIT_USER_AGENT
    }
    auth_response = requests.post(auth_url, data=auth_data, headers=auth_headers, auth=(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET))

    if auth_response.status_code != 200:
        return jsonify({"error": "Failed to authenticate with Reddit API", "status_code": auth_response.status_code}), 500

    access_token = auth_response.json().get('access_token')

    # Now, use the access token to search for posts
    search_url = f"https://oauth.reddit.com/search"
    search_params = {
        'q': query,
        'limit': 10,
        'sort': 'relevance'
    }
    search_headers = {
        'Authorization': f'Bearer {access_token}',
        'User-Agent': REDDIT_USER_AGENT
    }
    search_response = requests.get(search_url, params=search_params, headers=search_headers)

    if search_response.status_code == 200:
        reddit_data = search_response.json()
        posts = reddit_data.get('data', {}).get('children', [])
        if os.environ.get('WERKZEUG_RUN_MAIN') == 'true' and request.environ.get('HTTP_USER_AGENT'):
            for index, post in enumerate(posts[:3]):
                print(f"Post {index + 1} Title: {post.get('data', {}).get('title', 'No title available')}")
        return jsonify(reddit_data)
    else:
        return jsonify({"error": "Failed to fetch Reddit posts", "status_code": search_response.status_code}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)