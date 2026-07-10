import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        about: '',
        skills: '',
        experience: '',
        github_link: '',
        portfolio_link: '',
        profile_photo: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                about: user.about || '',
                skills: user.skills || '',
                experience: user.experience || '',
                github_link: user.github_link || '',
                portfolio_link: user.portfolio_link || '',
                profile_photo: user.profile_photo || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSaving(true);

        try {
            const response = await api.put('/profile/me', formData);
            // Update auth context with new user data
            const token = localStorage.getItem('token');
            login(response.data.user, token);
            setMessage('Profile updated successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-edit-container">
            <div className="auth-card profile-card-wide">
                <h2>Edit Your Profile</h2>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Full Name</label>
                            <input 
                                type="text" name="full_name"
                                value={formData.full_name} onChange={handleChange} required 
                            />
                        </div>
                        <div className="form-group half">
                            <label>Profile Photo URL</label>
                            <input 
                                type="text" name="profile_photo"
                                value={formData.profile_photo} onChange={handleChange} 
                                placeholder="https://example.com/photo.jpg"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>About Me</label>
                        <textarea 
                            name="about" rows="4"
                            value={formData.about} onChange={handleChange}
                            placeholder="Tell the community about yourself..."
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Skills (comma separated)</label>
                            <input 
                                type="text" name="skills"
                                value={formData.skills} onChange={handleChange} 
                                placeholder="React, Python, DevOps..."
                            />
                        </div>
                        <div className="form-group half">
                            <label>Experience</label>
                            <input 
                                type="text" name="experience"
                                value={formData.experience} onChange={handleChange} 
                                placeholder="e.g. 3 years as Full Stack Developer"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>GitHub Link</label>
                            <input 
                                type="url" name="github_link"
                                value={formData.github_link} onChange={handleChange} 
                            />
                        </div>
                        <div className="form-group half">
                            <label>Portfolio Link</label>
                            <input 
                                type="url" name="portfolio_link"
                                value={formData.portfolio_link} onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
