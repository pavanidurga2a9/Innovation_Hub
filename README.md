# Innovation Hub

A Collaborative Platform for Developers and Innovators.

## Tech Stack
- **Frontend**: React.js (Vite), CSS3
- **Backend**: Python Flask, REST APIs, Flask-JWT-Extended
- **Database**: PostgreSQL (Supabase via SQLAlchemy)

## Setup Instructions

### 1. Backend Setup (Flask + PostgreSQL)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   # Windows
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Connect to your Supabase PostgreSQL database by updating the `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres.your_project_ref:your_password@aws-0-region.pooler.supabase.com:6543/postgres
   ```
5. Run the server (this will automatically create the tables):
   ```bash
   python app.py
   ```

### 2. Frontend Setup (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- JWT Authentication (Login/Register)
- Interactive Developer Dashboard
- Profile Management
- Project Showcasing
- User Search Engine
- Direct Messaging System
