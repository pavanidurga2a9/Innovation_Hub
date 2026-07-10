import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Home, Search, MessageSquare, Briefcase } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Innovation Hub</Link>
            </div>
            <div className="nav-links">
                <Link to="/"><Home size={18} /> Home</Link>
                {user ? (
                    <>
                        <Link to="/search"><Search size={18} /> Search</Link>
                        <Link to="/dashboard"><Briefcase size={18} /> Dashboard</Link>
                        <Link to="/profile"><User size={18} /> Profile</Link>
                        <Link to="/chat"><MessageSquare size={18} /> Chat</Link>
                        <button onClick={handleLogout} className="btn-logout"><LogOut size={18} /> Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn-primary">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
