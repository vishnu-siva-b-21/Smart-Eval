from flask import Flask
from benx_1.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Importing all blueprints
    from benx_1.modules.faculty import faculty
    from benx_1.modules.student import student
    from benx_1.modules.main import main
    from benx_1.modules.errors import errors
    
    # Register all blueprints, setting their URL prefix
    app.register_blueprint(faculty, url_prefix="/faculty")
    app.register_blueprint(student, url_prefix="/student")
    app.register_blueprint(main, url_prefix="/")
    app.register_blueprint(errors)

    return app
