import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <header className="hero">
                <h1>Welcome to Innovation Hub</h1>
                <p>A Collaborative Platform for Developers and Innovators</p>
                <div className="hero-buttons">
                    <Link to="/register" className="btn-primary">Join Now</Link>
                    <Link to="/login" className="btn-secondary">Login</Link>
                </div>
            </header>
            
            <section className="features">
                <div className="feature-card">
                    <h3>Showcase Projects</h3>
                    <p>Display your best work, highlight your skills, and build your developer portfolio.</p>
                </div>
                <div className="feature-card">
                    <h3>Find Collaborators</h3>
                    <p>Search for developers with specific skills and technologies to join your next big idea.</p>
                </div>
                <div className="feature-card">
                    <h3>Connect & Chat</h3>
                    <p>Directly message other innovators and start building together.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
