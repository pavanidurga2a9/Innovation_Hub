from app import create_app
from config.db import db

app = create_app()

with app.app_context():
    print("Connecting to Supabase PostgreSQL...")
    db.create_all()
    print("All tables (users, projects, messages) created successfully!")
