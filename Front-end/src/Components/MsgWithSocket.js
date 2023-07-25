import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";
import SendIcon from "@mui/icons-material/Send";

const ENDPOINT = //'https://us-central1-oceanic-gecko-386413.cloudfunctions.net/realtime-chat';
'http://localhost:5000';
let socket;

const MsgWithSocket = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [userList, setUserList] = useState([]);

  const selectedChat = {
    _id: 1,
  };

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', userData);
    socket.on('connection', () => {
      setConnected(true);
    });

    socket.on('userJoined', (userName) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `${userName} joined the room`, isUser: false, sender: 'System' },
      ]);
    });

    socket.on('messageReceived', (messageData) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: messageData.text, isUser: false, sender: messageData.name },
      ]);
    });

    socket.on('userLeft', (userName) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `${userName} left the room`, isUser: false, sender: 'System' },
      ]);
    });

    socket.on('userList', (list) => {
      setUserList(list);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (inputText.trim() === '') {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: inputText, isUser: true },
    ]);

    const messageData = {
      text: inputText,
      room: selectedChat._id, // Use the selected chat's _id as the room name
      sender: userData.email // Add the sender's email to the message data
    };

    socket.emit('newMessage', messageData);

    setInputText('');
  };

  const toggleChat = () => {
    setIsExpanded((prevState) => !prevState);
    if (isExpanded === false) {
      socket.emit('joinChat', selectedChat._id);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className={`chatbot-widget ${isExpanded ? '' : 'minimized'}`}>
      <div className="chatbot-widget__header">
        <div className="chatbot-widget__header-text">Chat with your team</div>
        {isExpanded ? (
          <div onClick={toggleChat} style={{ marginTop: "-8px" }}>
            <MinimizeIcon />
          </div>
        ) : (
          <div onClick={toggleChat}>
            <AddIcon />
          </div>
        )}
      </div>
      <div className="chatbot-widget__messages">
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            {!message.isUser ? (
              <div style={{ display: 'flex' }}>
                <div className="message-bot">{message.sender}: {message.content}</div>
              </div>
            ) : (
              <div className="message-user">
                <span>You: </span>
                {message.content}
              </div>
            )}
            <span></span>
          </div>
        ))}
      </div>

      <form className="chatbot-widget__input" onSubmit={sendMessage}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type a message..."
          style={{ marginRight: '10px' }}
        />
       <SendIcon onClick={sendMessage} type="submit" color="primary" />
      </form>
      <div>
        <h2>User List:</h2>
        <ul>
          {userList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MsgWithSocket;
