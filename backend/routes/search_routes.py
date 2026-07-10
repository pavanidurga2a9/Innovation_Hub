from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.user import User
from config.db import db
from sqlalchemy import or_

search_bp = Blueprint('search', __name__)

@search_bp.route('/', methods=['GET'])
@jwt_required()
def search_users():
    query = request.args.get('q', '')
    
    if not query:
        return jsonify([]), 200

    # Search in skills, experience, or about
    search_term = f"%{query}%"
    users = User.query.filter(
        or_(
            User.skills.ilike(search_term),
            User.experience.ilike(search_term),
            User.about.ilike(search_term),
            User.full_name.ilike(search_term)
        )
    ).all()

    return jsonify([user.to_dict() for user in users]), 200
