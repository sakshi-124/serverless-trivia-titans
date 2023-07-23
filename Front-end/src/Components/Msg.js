  import AddIcon from "@mui/icons-material/Add";
  import MinimizeIcon from "@mui/icons-material/Minimize";
  import SendIcon from "@mui/icons-material/Send";
  import React, { useEffect, useState } from "react";
  import ChatBot from "../Assets/robot.png";
  import "../Components/ChatBot/ChatBotWidget.css"
  import io from 'socket.io-client'
  
  const ENDPOINT  = "http://localhost:5000";
  var socket , selectedChatCompare; 
  
  const Msg = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isConnected , setConnected] = useState(false);
 
    const userData = localStorage.getItem('user');

  
    const sendMessage = async (event) => {
      event.preventDefault();
  
      if (inputText.trim() === "") {
        return;
      }
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: inputText, isUser: true },
      ]);
  
      const params = {
        botAliasId: "TSTALIASID",
        botId: "HYFG8OJOUO",
        localeId: "en_US",
        sessionId: "UNIQUE_SESSION_ID",
        text: inputText,
      };
  
    //   try {
    //     const response = await lexClient.send(command);
    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { content: response.messages[0].content, isUser: false },
    //     ]);
    //   } catch (error) {
    //     console.error("Error sending message:", error);
    //   }
  
      setInputText("");
    };
  
    const toggleChat = () => {
      setIsExpanded((prevState) => !prevState);
    };
  
    const handleInputChange = (event) => {
      setInputText(event.target.value);
    };

    useEffect(() => {
        console.log(userData)

        socket = io(ENDPOINT )
        socket.emit('setup' , userData)
        socket.on('connection', () =>{
             setConnected(true)
        })
    
    }, [])
    
  
    return (
      <div className={`chatbot-widget ${isExpanded ? "" : "minimized"}`}>
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
            <div key={index} style={{ marginBottom: "10px" }}>
              {!message.isUser ? (
                <div style={{ display: "flex" }}>
                  <img src={ChatBot} alt="bot" class="img-chatbot" />
                  <div className={`message-bot`}>{message.content}</div>
                </div>
              ) : (
                <div className={`message-user`}>
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
            style={{ marginRight: "10px" }}
          />
          <SendIcon onClick={sendMessage} type="submit" color="primary" />
        </form>
      </div>
    );
  };
  
  export default Msg;
  