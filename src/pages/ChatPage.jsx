import { useEffect, useState } from 'react';
import ChatWindow from '../components/ChatWindow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL, apiFetch } from '../api.js';

export default function ChatPage() {
  const { token, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`${API_BASE_URL}/api/chat/rooms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allRooms = data.rooms || [];
        setRooms(allRooms);
        if (allRooms.length) setSelectedRoom(allRooms[0]);
      } catch (err) {
        setError(err.message || 'Could not load chat rooms.');
        setRooms([]);
        setSelectedRoom(null);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [token]);

  return (
    <div className="page chat-page">
      <section className="field-header">
        <div>
          <span className="section-label">Field Page / Anonymous Chat</span>
          <h1>Private Messaging</h1>
        </div>
        <span className="privacy-tag">Privacy First</span>
      </section>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="loading-box">Loading rooms...</div>}

      <section className="chat-layout">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-title">Anonymous Rooms</div>
          {rooms.length === 0 ? (
            <div className="empty-room">No active rooms</div>
          ) : (
            rooms.map(room => (
              <button key={room.id} className="room-button" onClick={() => setSelectedRoom(room)}>
                <span className="room-label">{room.id}</span>
              </button>
            ))
          )}
        </aside>

        <section className="chat-card">
          {selectedRoom ? (
            <ChatWindow roomId={selectedRoom.id} itemId={selectedRoom.itemId} ownerId={selectedRoom.ownerId} claimantId={selectedRoom.claimantId} />
          ) : (
            <div className="empty-chat-state">Choose a room to begin private messaging</div>
          )}
        </section>
      </section>
    </div>
  );
}
