from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from config.db import db

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

@profile_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    
    # Update fields if provided
    if 'full_name' in data: user.full_name = data['full_name']
    if 'about' in data: user.about = data['about']
    if 'skills' in data: user.skills = data['skills']
    if 'experience' in data: user.experience = data['experience']
    if 'github_link' in data: user.github_link = data['github_link']
    if 'portfolio_link' in data: user.portfolio_link = data['portfolio_link']
    if 'profile_photo' in data: user.profile_photo = data['profile_photo']

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully", "user": user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update profile", "error": str(e)}), 500

@profile_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Exclude sensitive information if needed, but to_dict doesn't include password
    return jsonify(user.to_dict()), 200
