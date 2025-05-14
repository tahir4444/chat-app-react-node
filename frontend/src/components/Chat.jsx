import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import API from '../api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/messages').then((res) => setMessages(res.data));

    socket.on('receive_message', (msg) => {
      if (msg.sender === username || msg.receiver === username) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('receive_message');
  }, [username]);

  const sendMessage = () => {
    if (!message || !receiver) return;
    socket.emit('send_message', { sender: username, receiver, message });
    setMessage('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {username}</h2>
      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="To (username)"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <br />
        <input
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3>Messages</h3>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}</strong> ➤ <em>{msg.receiver}</em>:{' '}
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
