import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('admin@campus.edu');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      const redirect = location.state?.from || '/dashboard';
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Campus Login</h1>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <input type="email" value={email} onBlur={() => setError('')} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required autoComplete="email" />
          <input type="password" value={password} onBlur={() => setError('')} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required autoComplete="current-password" />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <div className="auth-link">
          New student? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
