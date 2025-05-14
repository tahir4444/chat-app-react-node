import React, { useEffect, useState } from 'react';
import { logout, getToken } from '../utils/auth';
import axios from '../utils/api';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [receiver, setReceiver] = useState('');

  const username = JSON.parse(atob(getToken().split('.')[1])).username;

  useEffect(() => {
    fetchMessages();
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receive_message');
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get('/messages');
    setMessages(res.data);
  };

  const sendMessage = () => {
    const msg = { sender: username, receiver, message };
    socket.emit('send_message', msg);
    setMessage('');
  };

  return (
    <div>
      <h2>Welcome {username}</h2>
      <button onClick={logout}>Logout</button>
      <div
        style={{
          border: '1px solid gray',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender}</b>: {msg.message}
          </div>
        ))}
      </div>
      {/* <input
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="Receiver username"
      /> */}
      <select name="username" id="username">
        <option value="">Select User to send Message</option>
        <option value="tahir4444">tahir4444</option>
        <option value="tahir4445">admin</option>
      </select>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
