import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ id: number, message: string, dateCreated: string, userId: number, name: string }[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
   const navigate = useNavigate();


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/messages');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(data.reverse()); // Display newest messages at the bottom
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      try {
        const response = await fetch('http://localhost:3000/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input, name: 'Anonymous' }), // Include name
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Add new message to the end and ensure scrolling to the bottom
        setMessages([...messages, { id: data.id, message: input, dateCreated: new Date().toISOString(), userId: 1, name: 'Anonymous' }]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const handleBackClick = () => {
     navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
         <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
       
        <h1 className="text-xl font-semibold">Chat</h1>
         <button
          onClick={handleBackClick}
          className="text-white bg-gray-600 p-2 rounded-lg hover:bg-gray-700 focus:outline-none"
        >
          Back
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg ${msg.userId === 1 ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-gray-900 self-start'}`}
              >
                <p className="font-semibold">{msg.name}</p> {/* Display name */}
                <p>{msg.message}</p>
                <span className="text-sm text-gray-500">{new Date(msg.dateCreated).toLocaleString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white p-4 border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
