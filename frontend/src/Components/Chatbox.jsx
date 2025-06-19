import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SOCKET_SERVER_URL = "https://bookswap-mi28.onrender.com";

const ChatPage = () => {
  const { userId: chatPartnerId } = useParams(); // The ID of the other user in the chat
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode token payload to get user ID
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const userId = payload.id || payload._id;
        setCurrentUserId(userId);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUserId || !chatPartnerId) return;

    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server with id:", socketRef.current.id);
      // Join a personal room for this user so server can send direct messages
      socketRef.current.emit("join", currentUserId);
    });

    socketRef.current.on("receive-message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [currentUserId, chatPartnerId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    if (chatPartnerId === currentUserId) {
      alert("You cannot send message to yourself.");
      return;
    }

    const messageData = {
      senderId: currentUserId,
      receiverId: chatPartnerId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit("send-message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  if (!currentUserId) return <p>Please login to chat.</p>;
  if (!chatPartnerId) return <p>Invalid chat partner.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20 }}>
      <h3>Chat with User {chatPartnerId}</h3>

      <div
        style={{
          height: 400,
          overflowY: "auto",
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 10,
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet. Say hello!</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.senderId === currentUserId ? "right" : "left",
                margin: "10px 0",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: 10,
                  borderRadius: 15,
                  backgroundColor:
                    msg.senderId === currentUserId ? "#c6f6d5" : "#e2e8f0",
                }}
              >
                {msg.content}
                <br />
                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </span>
            </div>
          ))
        )}
      </div>

      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
        style={{
          width: "75%",
          padding: 10,
          marginRight: 8,
          borderRadius: 5,
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: 10,
          borderRadius: 5,
          backgroundColor: "#48bb78",
          color: "#fff",
          border: "none",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatPage;
