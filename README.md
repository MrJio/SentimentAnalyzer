# 🧠 Sentiment Analyzer Web App

This is a full-stack AI-powered web application that summarizes and analyzes the sentiment of **news articles** and **Reddit posts** based on any user-provided topic.

The app features:
- Live **summaries** of recent news articles using AI (BART transformer model)
- **Sentiment meter** (with emojis) showing public opinion from Reddit posts
- A **bar chart** summarizing positive, neutral, and negative Reddit posts
- **Saved searches** sidebar for easy re-analysis
- A clean, responsive, interactive frontend

---

## 📁 Project Structure

```
sentiment-analyzer/
├── backend/                # Flask + AI backend
│   ├── app.py              # Handles news summaries and news sentiment
│   ├── reddit_api.py       # Collects Reddit posts and performs sentiment classification
│   ├── .env                # Stores your API keys (you will create this)
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   └── (React code here)
└── README.md               # You are here!
```

---

## 🛠️ Backend Setup Guide (Python + Flask)

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate  # Use .venv\Scripts\activate on Windows
```

### 3. Install all dependencies

```bash
pip install -r requirements.txt
```

### 4. Add a `.env` file

In the `backend/` folder, create a file named `.env` with the following:

```
NEWS_API_KEY=your_newsapi_key_here
REDDIT_CLIENT_ID=your_reddit_client_id_here
REDDIT_CLIENT_SECRET=your_reddit_secret_here
REDDIT_USER_AGENT=your_unique_user_agent
```

> 💡 Need a NewsAPI key? Sign up at https://newsapi.org  
> 💡 Need Reddit keys? Go to https://www.reddit.com/prefs/apps and create a script application.

### 5. Run the servers

You’ll need **two terminal tabs**:

- First tab (for news summary):

```bash
python app.py
```

- Second tab (for Reddit sentiment):

```bash
python reddit_api.py
```

Both will say something like `Running on http://127.0.0.1:5001` or `:5002`.

---

## 🌐 Frontend Setup (React)

### 1. Navigate to the frontend folder

```bash
cd frontend
```

### 2. Install frontend dependencies

```bash
yarn install
```

### 3. Run the frontend app

```bash
yarn start
```

This will launch the app at:  
👉 http://localhost:3000

---

## ✅ Tools You Need Installed

| Tool        | Installation Guide                            |
|-------------|-----------------------------------------------|
| Python 3.8+ | https://www.python.org                        |
| Node.js     | https://nodejs.org (LTS version recommended)  |
| Yarn        | `npm install -g yarn`                         |

---

## 🤔 What If I Get Stuck?

- Make sure your API keys are valid and saved in `.env`
- Use `console.log()` in frontend or `print()` in backend for debugging
- Check your terminal for error messages and port conflicts

Happy building! 🚀