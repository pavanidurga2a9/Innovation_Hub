from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.project import Project
from config.db import db

project_bp = Blueprint('project', __name__)

@project_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get('name') or not data.get('description'):
        return jsonify({"message": "Project name and description are required"}), 400

    new_project = Project(
        user_id=current_user_id,
        name=data.get('name'),
        description=data.get('description'),
        technologies=data.get('technologies'),
        github_link=data.get('github_link')
    )

    try:
        db.session.add(new_project)
        db.session.commit()
        return jsonify({"message": "Project created successfully", "project": new_project.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create project", "error": str(e)}), 500

@project_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_projects(user_id):
    projects = Project.query.filter_by(user_id=user_id).all()
    return jsonify([project.to_dict() for project in projects]), 200

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = get_jwt_identity()
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"message": "Project not found"}), 404

    if str(project.user_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized to delete this project"}), 403

    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete project", "error": str(e)}), 500
