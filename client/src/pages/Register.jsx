import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: 'General' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please complete all required account fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <input type="text" value={form.name} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
          <input type="email" value={form.email} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Campus email" required />
          <input type="password" value={form.password} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
          <select value={form.department} onBlur={() => setError('')} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            <option>General</option>
            <option>Computer Science</option>
            <option>Engineering</option>
            <option>Administration</option>
          </select>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="auth-link">
          Already registered? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
