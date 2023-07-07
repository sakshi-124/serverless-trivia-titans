import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import AWS from "aws-sdk";
import React, { useEffect, useState } from "react";
import "./ChatBotWidget.css";

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = new AWS.Credentials({
    accessKeyId: "ASIAU22XNMOR267726TQ",
    secretAccessKey: "4fwuIUUMgNCBSB72Y+CbxdI/4jyoSf8R2aRJYgK6",
    sessionToken:
      "FwoGZXIvYXdzEP///////////wEaDBaU6QvXu0Unlk/35CLAATR/zfSZevmmIhTpGYsZrMZ8zBipEcGZTnoHDxnauuImpDHi3HIBLEBiiKuOfssB6BURks81tEp4jIKW5lj5WndwfHqRi/0V4q8Ta+/326vSCjYQs0WeIzUBTomLRVfIxekT9sOUTrcP67SkacF99CwpcmUrpij3jGOsDzAbicTGzrZ9TMhFlS0iATwk1WhyafVOE4EtZdS+CLkZPtUNH05fSjIMP4/TaRSqS6xnO6CC7gVf7j+xRi+ux0NstMf0/yim/qGlBjItyEyf5ogDwYW7aOzDHXHvt2Bqzd+4tJ4FJX6VXpuqhYXImKNu3ZQ6hxuz9ehw",
  });

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    AWS.config.update({
      region: "us-east-1",
      credentials,
    });
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (inputText.trim() === "") {
      return;
    }

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
      const command = new RecognizeTextCommand(params);
      const response = await lexClient.send(command);
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
    <div className={`chatbot-widget ${isExpanded ? "expanded" : ""}`}>
      <div className="chatbot-widget__header" onClick={toggleChat}>
        <div className="chatbot-widget__header-text">ChatBot</div>
        <div className="chatbot-widget__header-icon">
          {isExpanded ? "-" : "+"}
        </div>
      </div>
      <div className="chatbot-widget__messages">
        {messages.map((message, index) => (
          <div
            key={index}
            style={{ marginBottom: "10px" }}
            className={`message ${message.isUser ? "user" : "bot"}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      {isExpanded && (
        <form className="chatbot-widget__input" onSubmit={sendMessage}>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default ChatbotWidget;
