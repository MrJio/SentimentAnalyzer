import subprocess
import time

print("Starting app.py (news summarization API)...")
app_process = subprocess.Popen(["python3", "app.py"])

# Delay to help avoid port clashes or load errors
time.sleep(1)

print("Starting reddit_api.py (Reddit sentiment API)...")
reddit_process = subprocess.Popen(["python3", "reddit_api.py"])

try:
    app_process.wait()
    reddit_process.wait()
except KeyboardInterrupt:
    print("\nStopping both servers...")
    app_process.terminate()
    reddit_process.terminate()
