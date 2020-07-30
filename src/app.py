from flask import Flask

app = Flask(__name__)

@app.route("/function/", methods=['GET', 'POST'])
def home():
    return "hi"