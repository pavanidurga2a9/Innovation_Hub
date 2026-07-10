from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.message import Message
from models.user import User
from config.db import db
from sqlalchemy import or_, and_

message_bp = Blueprint('message', __name__)

@message_bp.route('/', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('receiver_id') or not data.get('content'):
        return jsonify({"message": "Receiver ID and content are required"}), 400

    receiver = User.query.get(data.get('receiver_id'))
    if not receiver:
        return jsonify({"message": "Receiver not found"}), 404

    new_message = Message(
        sender_id=current_user_id,
        receiver_id=data.get('receiver_id'),
        content=data.get('content')
    )

    try:
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"message": "Message sent successfully", "data": new_message.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to send message", "error": str(e)}), 500

@message_bp.route('/conversation/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_conversation(other_user_id):
    current_user_id = get_jwt_identity()

    # Get messages between current_user and other_user
    messages = Message.query.filter(
        or_(
            and_(Message.sender_id == current_user_id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == current_user_id)
        )
    ).order_by(Message.created_at.asc()).all()

    return jsonify([msg.to_dict() for msg in messages]), 200
