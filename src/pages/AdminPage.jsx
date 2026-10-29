import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL, apiFetch } from '../api.js';

export default function AdminPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ items: 0, users: 0, rooms: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`${API_BASE_URL}/api/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data.stats || { items: 0, users: 0, rooms: 0 });
      } catch (err) {
        setError(err.message || 'Admin overview failed');
        setStats({ items: 0, users: 0, rooms: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  return (
    <div className="page admin-page">
      <section className="field-header">
        <div>
          <span className="section-label">Admin / Campus Control</span>
          <h1>Administration</h1>
        </div>
        <span className="admin-tag">Secure Admin</span>
      </section>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="loading-box">Loading admin overview...</div>}

      <section className="admin-grid">
        <div className="stat-card large">
          <span>{stats.items}</span>
          <p>Total Listings</p>
        </div>
        <div className="stat-card large">
          <span>{stats.users}</span>
          <p>Community Users</p>
        </div>
        <div className="stat-card large">
          <span>{stats.rooms}</span>
          <p>Chat Rooms</p>
        </div>
      </section>
    </div>
  );
}
