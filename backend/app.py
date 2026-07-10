from flask import Flask
from flask_cors import CORS
from config.db import db
from models import *
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure Database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///local.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'default-secret-key')

    # Initialize extensions
    db.init_app(app)
    
    from flask_jwt_extended import JWTManager
    jwt = JWTManager(app)

    with app.app_context():
        # Create all tables if they do not exist
        db.create_all()

    # Route Registration
    from routes.auth_routes import auth_bp
    from routes.profile_routes import profile_bp
    from routes.project_routes import project_bp
    from routes.search_routes import search_bp
    from routes.message_routes import message_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(message_bp, url_prefix='/api/messages')

    @app.route('/')
    def index():
        return {"message": "Innovation Hub API is running"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
