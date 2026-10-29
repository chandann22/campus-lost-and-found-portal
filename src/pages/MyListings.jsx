import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL, apiFetch, DEFAULT_ITEM_IMAGE } from '../api.js';

export default function MyListings() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyItems();
  }, [token]);

  const fetchMyItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/items/my-listings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Unable to load your listings.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this listing? This action cannot be undone.')) return;

    setDeletingId(id);
    setError('');
    setSuccess('');

    const previousItems = [...items];
    const optimisticItems = items.filter(item => item.id !== id);
    setItems(optimisticItems);

    try {
      await apiFetch(`${API_BASE_URL}/api/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Listing removed.');
    } catch (err) {
      setItems(previousItems);
      setError(err.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page my-listings">
      <section className="field-header">
        <div>
          <span className="section-label">Field Page / My Listings</span>
          <h1>My Reports</h1>
        </div>
        <span className="user-tag">{user?.name}</span>
      </section>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {loading && <div className="loading-box">Loading your reports...</div>}
      {!loading && items.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>You have not created any listings yet.</p>
          <a className="primary-button" href="/lost">Create a lost listing</a>
        </div>
      )}

      {items.length > 0 && (
        <section className="listing-table-wrap">
          <table className="listing-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><span className={`badge ${item.itemType}`}>{item.itemType}</span></td>
                  <td className="item-title-cell">{item.title}</td>
                  <td>{item.location}</td>
                  <td>{item.status}</td>
                  <td>{item.date}</td>
                  <td>
                    <button className="danger-button" disabled={deletingId === item.id} onClick={() => remove(item.id)}>
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
