from config.db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile_photo = db.Column(db.String(255), nullable=True)
    about = db.Column(db.Text, nullable=True)
    skills = db.Column(db.String(500), nullable=True)
    experience = db.Column(db.String(500), nullable=True)
    github_link = db.Column(db.String(255), nullable=True)
    portfolio_link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    projects = db.relationship('Project', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'profile_photo': self.profile_photo,
            'about': self.about,
            'skills': self.skills,
            'experience': self.experience,
            'github_link': self.github_link,
            'portfolio_link': self.portfolio_link,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
