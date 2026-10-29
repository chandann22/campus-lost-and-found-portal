import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';
import { API_BASE_URL, apiFetch } from '../api.js';

export default function ChatWindow({ roomId, itemId, ownerId, claimantId }) {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (!roomId || !token) return;

    const newSocket = io(API_BASE_URL, {
      auth: { token: `Bearer ${token}` }
    });

    newSocket.emit('join-room', roomId);
    newSocket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    const fetchMessages = async () => {
      try {
        const data = await apiFetch(`${API_BASE_URL}/api/chat/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.message || 'Could not load chat messages.');
      }
    };

    fetchMessages();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, token]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !roomId || sending) return;
    setSending(true);
    setError('');
    try {
      socket.emit('send-message', { roomId, body: input.trim() });
      setInput('');
    } catch (err) {
      setError('Message failed to send.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-title">Private Chat</div>
      {error && <div className="error-box">{error}</div>}
      <div className="chat-messages" ref={messageListRef}>
        {messages.length === 0 ? (
          <div className="empty-chat">No messages yet</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="chat-message">
              <span className="chat-author">{msg.maskedSender || 'Anonymous'}</span>
              <span className="chat-body">{msg.body}</span>
            </div>
          ))
        )}
      </div>
      <div className="chat-form">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type anonymous message..." />
        <button disabled={sending || !input.trim()} onClick={sendMessage}>{sending ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  );
}
