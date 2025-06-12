import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const ChatBox = () => {
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef();

  const roomId = [currentUserId, userId].sort().join("_");

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.emit("joinRoom", { roomId });

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.emit("sendMessage", { roomId, message, sender: currentUserId });
      setMessages((prev) => [...prev, { message, sender: currentUserId }]);
      setMessage("");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto border rounded shadow mt-4 flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto border-b mb-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 max-w-xs break-words rounded ${
              msg.sender === currentUserId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex mt-auto">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-2 border rounded-l focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
