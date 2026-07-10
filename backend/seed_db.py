from app import create_app
from config.db import db
from models.user import User
from models.project import Project
from werkzeug.security import generate_password_hash

app = create_app()

def seed_database():
    with app.app_context():
        print("Starting database seeding...")
        
        # Check if we already seeded
        if User.query.filter_by(email="alex@example.com").first():
            print("Database already seeded! Skipping.")
            return

        # Create dummy users
        users_data = [
            {
                "full_name": "Alex Chen",
                "email": "alex@example.com",
                "password": generate_password_hash("password123"),
                "about": "Senior Full Stack Developer passionate about scalable web applications.",
                "skills": "React, Node.js, Python, PostgreSQL",
                "experience": "5+ years building enterprise SaaS platforms.",
                "github_link": "https://github.com",
                "portfolio_link": "https://example.com"
            },
            {
                "full_name": "Sarah Jenkins",
                "email": "sarah@example.com",
                "password": generate_password_hash("password123"),
                "about": "UI/UX Designer and Frontend Engineer. I make things look pretty and run fast.",
                "skills": "Figma, React, Tailwind CSS, Vue.js",
                "experience": "3 years as a Product Designer.",
                "github_link": "https://github.com",
                "portfolio_link": "https://example.com"
            },
            {
                "full_name": "David Kumar",
                "email": "david@example.com",
                "password": generate_password_hash("password123"),
                "about": "DevOps Engineer specializing in AWS and CI/CD pipelines.",
                "skills": "Docker, Kubernetes, AWS, Jenkins, Linux",
                "experience": "4 years automating infrastructure.",
                "github_link": "https://github.com",
                "portfolio_link": "https://example.com"
            }
        ]

        created_users = []
        for u_data in users_data:
            user = User(**u_data)
            db.session.add(user)
            created_users.append(user)
        
        db.session.commit()
        print(f"Created {len(created_users)} dummy users.")

        # Create dummy projects
        projects_data = [
            {
                "user_id": created_users[0].id,
                "name": "E-Commerce Microservices",
                "description": "A scalable e-commerce backend built with Flask and Docker.",
                "technologies": "Python, Flask, Docker, PostgreSQL",
                "github_link": "https://github.com"
            },
            {
                "user_id": created_users[0].id,
                "name": "Real-time Chat App",
                "description": "WebSocket based chat application.",
                "technologies": "React, Node.js, Socket.io",
                "github_link": "https://github.com"
            },
            {
                "user_id": created_users[1].id,
                "name": "Fintech Dashboard UI",
                "description": "A beautiful, responsive dashboard for tracking cryptocurrency.",
                "technologies": "React, Tailwind, Recharts",
                "github_link": "https://github.com"
            },
            {
                "user_id": created_users[2].id,
                "name": "K8s Auto-Scaler",
                "description": "Custom controller for Kubernetes auto-scaling based on custom metrics.",
                "technologies": "Go, Kubernetes, Prometheus",
                "github_link": "https://github.com"
            }
        ]

        for p_data in projects_data:
            project = Project(**p_data)
            db.session.add(project)
        
        db.session.commit()
        print("Created dummy projects.")
        print("Seeding complete!")

if __name__ == "__main__":
    seed_database()
