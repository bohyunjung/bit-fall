import argparse
import random
import datetime
from flask import Flask, request, render_template
app = Flask(__name__)

messages = []

@app.route('/post', methods=["GET", "POST"])
def post():
    global messages
    message = request.form.get('message')
    if message:
        messages.append(message)
    return render_template('post.html')

@app.route('/fetch')
def fetch():
    if messages:
        return messages.pop()
    return random.choice(["안녕하세요","HELLO","BONJOUR","HOLA","HALLO","CIAO","ULPC","ff4f01",str(datetime.date.today())])

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', default=10090, type=int)
    parser.add_argument('--debug', action='store_true')
    args = parser.parse_args()

    app.debug = args.debug
    app.run('0.0.0.0', args.port)
