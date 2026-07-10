from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from config.db import db
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate input
    if not data or not data.get('full_name') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if user already exists
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "User already exists with this email"}), 409

    # Hash the password
    hashed_password = generate_password_hash(data.get('password'), method='pbkdf2:sha256')

    # Create new user
    new_user = User(
        full_name=data.get('full_name'),
        email=data.get('email'),
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to register user", "error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing email or password"}), 400

    # Find user by email
    user = User.query.filter_by(email=data.get('email')).first()

    # Verify password
    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({"message": "Invalid email or password"}), 401

    # Generate JWT
    expires = datetime.timedelta(days=1)
    access_token = create_access_token(identity=str(user.id), expires_delta=expires)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    return jsonify({"message": "Token is valid", "user": user.to_dict()}), 200
