import React, { useCallback, useEffect, useRef, useState } from 'react';
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";
import SendIcon from "@mui/icons-material/Send";
import { useForkRef } from '@mui/material';

const ENDPOINT = 'wss://r6s5zxfky2.execute-api.us-east-1.amazonaws.com/production'; // Replace this with your WebSocket API endpoint

const Msg = () => {

  //const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [userList, setUserList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  //const socket = useRef < WebSocket | null > (null);

  const userData = JSON.parse(localStorage.getItem('user'));

  const ENDPOINT = 'wss://r6s5zxfky2.execute-api.us-east-1.amazonaws.com/production'; // Replace this with your WebSocket API endpoint
  const socketRef = useRef(null);
  
  socketRef.current = new WebSocket(ENDPOINT);

  useEffect(() => {

    if (socketRef.current?.readyState !== WebSocket.OPEN) {
    socketRef.current.onopen = () => {
      console.log('WebSocket connection established.');
      socketRef.current.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
    };
  }
  if(socketRef.current?.readyState === WebSocket.OPEN)
  {
    socketRef.current.send(JSON.stringify({ action: 'setName', name: userData.name }));

    socketRef.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log('Received message:', receivedMessage);

      setCurrentQuestionIndex(receivedMessage.questionIndex);
      setQuestions(receivedMessage.questions);
  
      if (receivedMessage.System) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: receivedMessage.System, isUser: false },
        ]);
      } else {
        // Update the state with user messages
        if (receivedMessage.name !== userData.name) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: receivedMessage.message, isUser: false },
          ]);
        }
      }
    };
  
  }



   // socketRef.current.onclose = (event) => {
    //   console.log('WebSocket connection closed:', event.code, event.reason);
    // };

  },[])

   
  const onSocketMessage = useCallback((dataStr) => {
    socketRef.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log('Received message:', receivedMessage);
  
      if (receivedMessage.System) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: receivedMessage.System, isUser: false },
        ]);
      } else {
        // Update the state with user messages
        if (receivedMessage.name !== userData.name) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: receivedMessage.message, isUser: false },
          ]);
        }
      }
    };
  
  }, []);

  // useEffect(() => {

  //   }
  // )
  

  // useEffect(() => {
  //   socketRef.current.onmessage = (event) => {
  //     const receivedMessage = JSON.parse(event.data);
  //     console.log('Received message:', receivedMessage);

  //     if (receivedMessage.StystemMessage) {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { content: receivedMessage.StystemMessage, isSystem: true },
  //       ]);
  //     } else {
  //       // Update the state with user messages
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { content: receivedMessage.message, isUser: false },
  //       ]);
  //     }
  //   };
  // })


  const sendMessage = (event) => {
    event.preventDefault();

    if (inputText.trim() === '') {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: inputText, isUser: true },
    ]);

    socketRef.current.send(JSON.stringify({ action: 'sendPublic', message: inputText })); // Send the message to the WebSocket server

    setInputText('');

  };

  const toggleChat = () => {
    setIsExpanded((prevState) => !prevState);
    if (isExpanded === false) {
      //socket.send(JSON.stringify({ type: 'joinChat', room: selectedChat._id }));
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

export default Msg;
