import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL, apiFetch } from '../api.js';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ items: 0, users: 0, rooms: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const requests = [apiFetch(`${API_BASE_URL}/api/items`, { headers })];

      if (user?.role === 'admin') {
        requests.push(apiFetch(`${API_BASE_URL}/api/admin/overview`, { headers }));
      }

      const [itemsResponse, statsResponse] = await Promise.all(requests);

      const loadedItems = itemsResponse.items || [];
      setItems(loadedItems);
      setStats(
        statsResponse?.stats || { items: loadedItems.length, users: 0, rooms: 0 }
      );
    } catch (err) {
      setError(err.message || 'Dashboard could not be loaded.');
      setItems([]);
      setStats({ items: 0, users: 0, rooms: 0 });
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, [token, user?.role]);

  return (
    <div className="page dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="section-label">🏫 Campus Overview</span>
          <h1>Welcome, {user?.name} 👋</h1>
          <p className="muted-text">🗺️ Track lost and found activity across the campus.</p>
        </div>
        <div className="dashboard-actions">
          <Link className="primary-button" to="/lost">🧳 Report Lost</Link>
          <Link className="secondary-button" to="/found">🔍 Report Found</Link>
        </div>
      </section>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="loading-box">Loading campus overview...</div>}

      <section className="stats-grid">
  <div className="stat-card"><span>{stats.items}</span><p>📦 Total Listings</p></div>
  {user?.role === 'admin' && (
    <>
      <div className="stat-card"><span>{stats.users}</span><p>👥 Community Members</p></div>
      <div className="stat-card"><span>{stats.rooms}</span><p>💬 Private Chats</p></div>
    </>
  )}
</section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-title">📣 Latest Activity</div>
          <div className="activity-list">
            {items.length === 0 ? (
              <div className="empty-state compact">
                <span className="empty-icon">📭</span>
                <p>No latest activity yet.</p>
              </div>
            ) : items.slice(0, 5).map(item => (
              <div className="activity-item" key={item.id}>
                <span className="activity-type">[{item.itemType}]</span>
                <span className="truncate-text">{item.title}</span>
                <span className="activity-location">📍 {item.location}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">🌍 Field Pages</div>
          <div className="field-list">
            <Link to="/lost">🧳 Lost Field</Link>
            <Link to="/found">🔍 Found Field</Link>
            <Link to="/my-listings">📋 My Listings</Link>
            <Link to="/chat">💬 Anonymous Chat</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
