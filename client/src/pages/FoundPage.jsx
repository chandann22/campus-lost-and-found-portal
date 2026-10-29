import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL, apiFetch, DEFAULT_ITEM_IMAGE } from '../api.js';

export default function FoundPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'Electronics', description: '', location: 'Computer Lab', date: new Date().toISOString().slice(0, 10), imageUrl: '', itemType: 'found' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/items`);
      setItems((data.items || []).filter(i => i.itemType === 'found'));
    } catch (err) {
      setError(err.message || 'Could not load found items.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.date) {
      setError('Please complete all required found item fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = await apiFetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      setItems(prev => [payload.item, ...prev]);
      setForm({ title: '', category: 'Electronics', description: '', location: 'Computer Lab', date: new Date().toISOString().slice(0, 10), imageUrl: '', itemType: 'found' });
      setSuccess('Found listing created.');
      await fetchItems();
    } catch (err) {
      setError(err.message || 'Found listing could not be created.');
    } finally {
      setSubmitting(false);
    }
  };

  const initiateChat = async (item) => {
    setError('');
    try {
      const payload = {
        itemId: item.id,
        ownerId: item.ownerId,
        claimantId: localStorage.getItem('campus_user') ? JSON.parse(localStorage.getItem('campus_user')).id : 'user-student-1'
      };

      await apiFetch(`${API_BASE_URL}/api/chat/initiate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      window.location.assign('/chat');
    } catch (err) {
      setError(err.message || 'Chat room could not be started.');
    }
  };

  return (
    <div className="page field-page">
      <section className="field-header">
        <div>
          <span className="section-label">Field Page / Found</span>
          <h1>Found Items</h1>
        </div>
        <button className="primary-button">Found Reports</button>
      </section>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <section className="field-grid">
        <div className="form-panel">
          <h3>Report a Found Item</h3>
          <form className="listing-form" onSubmit={submit} noValidate>
            <input type="text" value={form.title} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Item title" required />
            <select value={form.category} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Bag</option>
              <option>Electronics</option>
              <option>Identity</option>
              <option>Books</option>
              <option>Personal</option>
            </select>
            <input type="text" value={form.location} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" required />
            <input type="date" value={form.date} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <textarea value={form.description} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required />
            <input type="url" value={form.imageUrl} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Creating listing...' : 'Create Found Listing'}
            </button>
          </form>
        </div>

        <div className="results-panel">
          <div className="search-row">
            <input type="text" placeholder="Search found reports..." className="search-input" />
          </div>
          {loading && <div className="loading-box">Loading found reports...</div>}
          {!loading && items.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No found items reported yet.</p>
              <button className="primary-button" onClick={() => setForm({ ...form, itemType: 'found' })}>Create the first found report</button>
            </div>
          )}
          <div className="item-list">
            {items.map(item => (
              <article className="item-card" key={item.id}>
                <div className="item-image-wrap">
                  <img src={item.imageUrl || DEFAULT_ITEM_IMAGE} alt="" className="item-image" onError={(e) => { e.currentTarget.src = DEFAULT_ITEM_IMAGE; }} />
                </div>
                <div className="item-content">
                  <div className="item-meta">
                    <span className="badge found">Found</span>
                    <span>{item.category}</span>
                  </div>
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-details">
                    <span>{item.location}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="card-actions">
                    <button className="chat-button" onClick={() => initiateChat(item)}>Chat with Reporter</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
