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

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = new AWS.Credentials({
    accessKeyId: "ASIAU22XNMOR3HS62INC",
    secretAccessKey: "3vR4o+lkpEfH4tma10DyHHmKdmTSJmjWPuwYW0oJ",
    sessionToken:
      "FwoGZXIvYXdzECcaDMPOk9ewb/vuO+E8LyLAAUmyYafa9pAFBChl7bm1zewcsQpUZIx2wwgqX/Mm3vcCQFx6Z8GCxq32uNTPI6KU9dchE++S5iHHm7Gk5yH8VcFATUpDR3M7uOmJBbEgIg1W6zN2eQRWjDJH2SyAapVlfkpfb7mSi9xk8yNY1ovjV+P8TWPY6imBU3/HjxY4+VIaR7PEQion+Upas7PzhlZWXcJMLSDiJ0tS4nDaT2IyVU2MgsuBaN9PwAqlxRJNnA7BbBD79m9uclmWVsQMD269ZCjN5qqlBjIt9Xjj886ZeCv9Q45BVTWr52VSK4FiTasQiZf+kR548BCHRHMPXBJDV3TWrCky",
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

export default ChatbotWidget;
