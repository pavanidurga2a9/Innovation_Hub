import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Search, Edit3, Link2, ExternalLink, Briefcase, MessageSquare, Terminal } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    
    // New project form state
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        technologies: '',
        github_link: ''
    });

    useEffect(() => {
        fetchProjects();
    }, [user]);

    const fetchProjects = async () => {
        if (user?.id) {
            try {
                const response = await api.get(`/projects/user/${user.id}`);
                setProjects(response.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects/', newProject);
            setShowAddForm(false);
            setNewProject({ name: '', description: '', technologies: '', github_link: '' });
            fetchProjects(); // Refresh the list
        } catch (error) {
            console.error("Failed to add project", error);
            alert("Error adding project");
        }
    };

    if (!user) return <div>Loading...</div>;

    // Split skills into an array for badges
    const renderSkills = (skillsString) => {
        if (!skillsString) return <span className="text-secondary">Not specified</span>;
        return skillsString.split(',').map((skill, index) => (
            <span key={index} className="skill-badge">{skill.trim()}</span>
        ));
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-rich">
                <div className="header-text">
                    <h2>Welcome back, <span className="highlight">{user.full_name ? user.full_name.split(' ')[0] : 'Developer'}</span>! 👋</h2>
                    <p>Here's what's happening with your profile today.</p>
                </div>
                <div className="quick-actions">
                    <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
                        <Plus size={18} /> Add Project
                    </button>
                    <button onClick={() => navigate('/search')} className="btn-secondary">
                        <Search size={18} /> Find Collaborators
                    </button>
                </div>
            </div>

            {/* Statistics Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon"><Briefcase size={24} /></div>
                    <div className="stat-details">
                        <h4>{projects.length}</h4>
                        <p>Total Projects</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Terminal size={24} /></div>
                    <div className="stat-details">
                        <h4>{user.skills ? user.skills.split(',').length : 0}</h4>
                        <p>Skills Listed</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><MessageSquare size={24} /></div>
                    <div className="stat-details">
                        <h4>Active</h4>
                        <p>Messaging Status</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Profile Overview Card */}
                <div className="profile-card dashboard-section">
                    <div className="section-header-inline">
                        <h3>Profile Overview</h3>
                        <Link to="/profile" className="icon-btn"><Edit3 size={18} /></Link>
                    </div>
                    
                    <div className="profile-main-info">
                        {user.profile_photo ? (
                            <img src={user.profile_photo} alt="Profile" className="profile-photo-large" />
                        ) : (
                            <div className="profile-photo-placeholder-large">
                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <div className="profile-titles">
                            <h4>{user.full_name}</h4>
                            <p className="text-secondary">{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-details-block">
                        <h5>About</h5>
                        <p>{user.about || 'Tell the world about yourself...'}</p>
                    </div>

                    <div className="profile-details-block">
                        <h5>Top Skills</h5>
                        <div className="skills-container">
                            {renderSkills(user.skills)}
                        </div>
                    </div>

                    <div className="profile-details-block">
                        <h5>Experience</h5>
                        <p>{user.experience || 'Not specified'}</p>
                    </div>

                    <div className="profile-links">
                        {user.github_link && (
                            <a href={user.github_link} target="_blank" rel="noopener noreferrer" className="social-link">
                                <Link2 size={18} /> GitHub Profile
                            </a>
                        )}
                        {user.portfolio_link && (
                            <a href={user.portfolio_link} target="_blank" rel="noopener noreferrer" className="social-link">
                                <ExternalLink size={18} /> Portfolio
                            </a>
                        )}
                    </div>
                </div>

                {/* Projects Section */}
                <div className="projects-section dashboard-section">
                    <div className="section-header">
                        <h3>Your Projects Showroom</h3>
                    </div>
                    
                    {/* Add Project Form (Conditionally Rendered) */}
                    {showAddForm && (
                        <div className="add-project-form-container glass-effect">
                            <h4>Publish a New Project</h4>
                            <form onSubmit={handleAddProject} className="add-project-form">
                                <div className="form-group">
                                    <label>Project Name *</label>
                                    <input type="text" required value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="e.g. E-Commerce Platform" />
                                </div>
                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea required rows="3" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="What does this project do?" />
                                </div>
                                <div className="form-group">
                                    <label>Technologies Used *</label>
                                    <input type="text" required value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} placeholder="e.g. React, Node.js, MongoDB" />
                                </div>
                                <div className="form-group">
                                    <label>GitHub Repository Link</label>
                                    <input type="url" value={newProject.github_link} onChange={e => setNewProject({...newProject, github_link: e.target.value})} placeholder="https://github.com/..." />
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
                                    <button type="submit" className="btn-primary">Publish Project</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <p>Loading projects...</p>
                    ) : projects.length > 0 ? (
                        <div className="projects-list">
                            {projects.map(project => (
                                <div key={project.id} className="project-card rich-card">
                                    <div className="project-card-header">
                                        <h4>{project.name}</h4>
                                        {project.github_link && (
                                            <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="icon-link">
                                                <Link2 size={20} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="project-desc">{project.description}</p>
                                    <div className="project-footer">
                                        <div className="tech-stack-mini">
                                            {project.technologies && project.technologies.split(',').map((tech, i) => (
                                                <span key={i} className="mini-badge">{tech.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !showAddForm && (
                            <div className="empty-state">
                                <div className="empty-icon"><Briefcase size={48} /></div>
                                <h4>No Projects Yet</h4>
                                <p>Showcase your skills by uploading your best work.</p>
                                <button onClick={() => setShowAddForm(true)} className="btn-primary mt-3">Add Your First Project</button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
