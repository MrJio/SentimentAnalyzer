#We will remove this from git and upload to Render when its time
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_articles(articles):
    if len(articles) < 3:
        return "Not enough articles to summarize."
    
    combined_text = " ".join([
        f"{article.get('title', 'No Title')}. {article.get('description', 'No Description')} {article.get('lead_paragraph', '')}"
        for article in articles
    ])

    combined_text = combined_text[:4000]  

    word_count = len(combined_text.split())
    max_len = min(800, word_count)
    min_len = max(300, max_len // 2)

    final_summary = summarizer(combined_text, max_length=max_len, min_length=min_len, do_sample=False)

    return final_summary[0]['summary_text']