const connectedUsers = new Map(); // userId => Set of socketIds

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.userId = userId;

      // Add socket.id to the set of sockets for this user
      if (connectedUsers.has(userId)) {
        connectedUsers.get(userId).add(socket.id);
      } else {
        connectedUsers.set(userId, new Set([socket.id]));
      }

      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    socket.on("send-message", (messageData) => {
      const { senderId, receiverId, content, timestamp } = messageData;

      console.log(`Message from ${senderId} to ${receiverId}: ${content}`);

      // Emit to all sockets of receiver (in case user has multiple connections)
      const receiverSockets = connectedUsers.get(receiverId);
      if (receiverSockets) {
        for (const receiverSocketId of receiverSockets) {
          io.to(receiverSocketId).emit("receive-message", messageData);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const userId = socket.userId;
      if (userId && connectedUsers.has(userId)) {
        const userSockets = connectedUsers.get(userId);
        userSockets.delete(socket.id);

        // If no more sockets for this user, remove the user from map
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
        }
      }
    });
  });
}

module.exports = setupSocket;
