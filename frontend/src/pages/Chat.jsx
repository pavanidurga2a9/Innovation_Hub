import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const otherUserId = searchParams.get('user');
    const otherUserName = searchParams.get('name') || 'User';

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (otherUserId) {
            fetchMessages();
        }
    }, [otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/messages/conversation/${otherUserId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !otherUserId) return;

        try {
            const response = await api.post('/messages/', {
                receiver_id: parseInt(otherUserId),
                content: newMessage
            });
            
            // Append the new message to the list
            setMessages([...messages, response.data.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (!otherUserId) {
        return (
            <div className="chat-container empty-state">
                <h2>Direct Messages</h2>
                <p>Go to the Search page and click "Message" on a user to start a conversation.</p>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Chat with {otherUserName}</h3>
            </div>
            
            <div className="chat-messages">
                {loading ? (
                    <p className="text-center">Loading conversation...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center">No messages yet. Say hi!</p>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <div key={idx} className={`message ${isMe ? 'message-sent' : 'message-received'}`}>
                                <div className="message-content">
                                    <p>{msg.content}</p>
                                    <span className="message-time">
                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-area">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="btn-primary">Send</button>
            </form>
        </div>
    );
};

export default Chat;
