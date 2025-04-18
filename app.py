from benx_1 import create_app
from waitress import serve

app = create_app()

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=8000)
    # app.run(debug=1)
