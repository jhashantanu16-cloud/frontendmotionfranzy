import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import ContentManager from '../components/ContentManager';
import MarketingPanel from '../components/MarketingPanel';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setLoading(false);
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, subsRes, messagesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/stats`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/users`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/subscriptions`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/messages`, { headers }),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSubscriptions(subsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageReply = async (item) => {
    if (!replyText.trim()) return setReplyStatus('Please enter a reply.');
    try {
      setReplyStatus('Sending…');
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/messages/${item._id}/reply`, {
        subject: 'Re: Your Motion Franzy inquiry',
        message: replyText,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setMessages((current) => current.map((message) => message._id === item._id ? { ...message, status: 'replied' } : message));
      setReplyText('');
      setReplyingTo(null);
      setReplyStatus('Reply sent successfully.');
    } catch (error) {
      setReplyStatus(error.response?.data?.message || 'Reply could not be sent.');
    }
  };

  const deleteMessage = async (item) => {
    if (!window.confirm(`Delete the message from ${item.name}? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/admin/messages/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((current) => current.filter((message) => message._id !== item._id));
      if (replyingTo === item._id) setReplyingTo(null);
      setReplyStatus('Message deleted.');
    } catch (error) {
      setReplyStatus(error.response?.data?.message || 'Message could not be deleted.');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="wrap">
        <div className="admin-header admin-header-row">
          <div>
            <h1 className="display">Admin Dashboard</h1>
            <p>Manage users, subscriptions, and website content.</p>
          </div>
          <button type="button" className="admin-logout" onClick={onLogout}>Logout</button>
        </div>

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>
          <button className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('subscriptions')}>Subscriptions</button>
          <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages {messages.length > 0 ? `(${messages.length})` : ''}</button>
          <button className={`tab-btn ${activeTab === 'marketing' ? 'active' : ''}`} onClick={() => setActiveTab('marketing')}>Marketing</button>
          <button className={`tab-btn ${activeTab === 'cms' ? 'active' : ''}`} onClick={() => setActiveTab('cms')}>CMS</button>
        </div>

        {activeTab === 'marketing' && (
          <div className="admin-content">
            <MarketingPanel />
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="admin-content">
            <ContentManager user={user} />
          </div>
        )}

        {activeTab === 'overview' && stats && (
          <div className="admin-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-data">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-data">
                  <div className="stat-value">${stats.totalRevenue}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name || 'User'}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="admin-content">
            {subscriptions.length === 0 ? (
              <p>No subscriptions yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Customer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub._id}>
                      <td>{sub.plan || 'Basic'}</td>
                      <td>{sub.customerName || 'Customer'}</td>
                      <td>{sub.status || 'Active'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="admin-content">
            {messages.length === 0 ? <p>No messages yet.</p> : (
              <div className="message-list">
                {messages.map((item) => (
                  <article className="message-card" key={item._id}>
                    <div className="message-card-head">
                      <div><strong>{item.name}</strong><a href={`mailto:${item.email}`}>{item.email}</a></div>
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    {item.plan && <div className="message-plan">Plan inquiry: {item.plan}</div>}
                    {item.source && <div className="message-plan">Source: {item.source}</div>}
                    <p>{item.message}</p>
                    <div className="message-actions"><button type="button" className="reply-link reply-button" onClick={() => { setReplyingTo(item._id); setReplyStatus(''); }}>Reply</button><button type="button" className="delete-message-button" onClick={() => deleteMessage(item)}>Delete</button></div>
                    {replyingTo === item._id && <div className="reply-form"><textarea rows="5" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={`Reply to ${item.name}…`} /><div><button type="button" className="btn-primary" onClick={() => sendMessageReply(item)}>Send Reply</button><button type="button" className="btn-secondary" onClick={() => setReplyingTo(null)}>Cancel</button></div></div>}
                  </article>
                ))}
                {replyStatus && <div className="reply-status">{replyStatus}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
