import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";
import SendIcon from "@mui/icons-material/Send";
import AWS from "aws-sdk";
import React, { useEffect, useState } from "react";
import ChatBot from "../../Assets/robot.png";
import "./ChatBotWidget.css";

/**
 * Component for rendering a chatbot widget.
 */
const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);

  const [inputText, setInputText] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = new AWS.Credentials({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
  });

  // Initialize AWS SDK on component mount
  useEffect(() => {
    initializeChat();
  }, []);

  /**
   * Initializes the AWS SDK with the configured region and credentials.
   */
  const initializeChat = async () => {
    AWS.config.update({
      region: "us-east-1",
      credentials,
    });
  };

  /**
   * Sends a user message to the Lex bot and receives a response.
   */
  const sendMessage = async (event) => {
    event.preventDefault();

    if (inputText.trim() === "") {
      return;
    }

    // Add user message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: inputText, isUser: true },
    ]);

    const lexClient = new LexRuntimeV2Client({
      region: "us-east-1",
      credentials,
    });

    const params = {
      botAliasId: "TSTALIASID",
      botId: "HYFG8OJOUO",
      localeId: "en_US",
      sessionId: "UNIQUE_SESSION_ID",
      text: inputText,
    };

    try {
      // Send RecognizeTextCommand to Lex
      const command = new RecognizeTextCommand(params);
      const response = await lexClient.send(command);

      // Add bot response to the messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: response.messages[0].content, isUser: false },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInputText("");
  };

  const toggleChat = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className={`chatbot-widget ${isExpanded ? "" : "minimized"}`}>
      <div className="chatbot-widget__header">
        <div className="chatbot-widget__header-text">ChatBot</div>
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
                <img src={ChatBot} alt="bot" className="img-chatbot" />
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

export default ChatbotWidget;
