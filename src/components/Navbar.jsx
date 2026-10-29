import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon" aria-label="Campus icon">🏫</span>
        <span className="brand-copy">
          <span className="brand-title">Campus Items Lost & Found Report Portal</span>
          <span className="brand-subtitle">Chandan & Vivek</span>
        </span>
      </div>

      <div className="nav-links">
        {!user ? (
          <>
            <NavLink className="nav-link" to="/login">🔐 Login</NavLink>
            <NavLink className="nav-link" to="/register">✨ Register</NavLink>
          </>
        ) : (
          <>
            <NavLink className="nav-link" to="/dashboard">📊 Dashboard</NavLink>
            <NavLink className="nav-link" to="/lost">🧳 Lost</NavLink>
            <NavLink className="nav-link" to="/found">🔍 Found</NavLink>
            <NavLink className="nav-link" to="/my-listings">📋 My Listings</NavLink>
            <NavLink className="nav-link" to="/chat">💬 Chat</NavLink>
            {user.role === 'admin' && <NavLink className="nav-link" to="/admin">🛡️ Admin</NavLink>}
            <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
