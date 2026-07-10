import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search as SearchIcon, User } from 'lucide-react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial fetch to show all users
    useEffect(() => {
        handleSearch('');
    }, []);

    const handleSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await api.get(`/search?q=${searchQuery}`);
            setResults(response.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <div className="search-container">
            <div className="search-header">
                <h2>Find Collaborators</h2>
                <form onSubmit={onSubmit} className="search-form">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by skills, experience, or name..."
                        className="search-input"
                    />
                    <button type="submit" className="btn-primary search-btn">
                        <SearchIcon size={18} /> Search
                    </button>
                </form>
            </div>

            <div className="search-results">
                {loading ? (
                    <p>Loading results...</p>
                ) : results.length > 0 ? (
                    <div className="users-grid">
                        {results.map(user => (
                            <div key={user.id} className="user-card">
                                <div className="user-card-header">
                                    {user.profile_photo ? (
                                        <img src={user.profile_photo} alt={user.full_name} className="user-avatar" />
                                    ) : (
                                        <div className="user-avatar-placeholder"><User size={24} /></div>
                                    )}
                                    <div className="user-info">
                                        <h3>
                                            {user.full_name}
                                            <span className="online-dot" title="Online Now"></span>
                                        </h3>
                                        <p className="user-skills">{user.skills || 'No skills listed'}</p>
                                    </div>
                                </div>
                                <p className="user-experience">{user.experience}</p>
                                <div className="user-actions">
                                    <Link to={`/chat?user=${user.id}&name=${encodeURIComponent(user.full_name)}`} className="btn-secondary">Message</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No users found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
