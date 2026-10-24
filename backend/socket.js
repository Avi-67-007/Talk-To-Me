
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const onlineUsers = new Map();

const setupSocket = (httpServer) => {
  const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
  ].filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.id) {
        return next(new Error("Invalid token"));
      }

      socket.userId = String(decoded.id);
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    socket.join(userId);
    console.log("Authenticated socket connected:", userId);

    onlineUsers.set(userId, socket.id);
    io.emit("users:online", [...onlineUsers.keys()]);

    socket.on("message:send", ({ receiverId, message } = {}) => {
      if (!receiverId || !message) return;
      if (String(message.senderId) !== userId) return;

      const receiverSocketId = onlineUsers.get(String(receiverId));

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:new", message);
      }
    });

    socket.on("typing:start", ({ receiverId } = {}) => {
      if (!receiverId) return;

      const receiverSocketId = onlineUsers.get(String(receiverId));

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user:typing", {
          userId,
          isTyping: true,
        });
      }
    });

    socket.on("typing:stop", ({ receiverId } = {}) => {
      if (!receiverId) return;

      const receiverSocketId = onlineUsers.get(String(receiverId));

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user:typing", {
          userId,
          isTyping: false,
        });
      }
    });

    socket.on("disconnect", () => {
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
      }

      io.emit("users:online", [...onlineUsers.keys()]);
      console.log("Socket disconnected:", userId);
    });
  });

  return io;
};

export default setupSocket;
