
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !text?.trim()) {
      return res.status(400).json({
        message: "Receiver and message text are required"
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text: text.trim()
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    console.error("Send message error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.user.id;

    // Find only a message sent by the authenticated user
    const message = await Message.findOne({
      _id: messageId,
      senderId: currentUserId
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found or you cannot delete it"
      });
    }

    const receiverId = String(message.receiverId);
    const deletedMessageId = String(message._id);

    // Delete from MongoDB first
    await Message.deleteOne({
      _id: message._id,
      senderId: currentUserId
    });

    // Notify the recipient after successful deletion
    const io = req.app.get("io");

    if (io) {
      io.to(receiverId).emit("message:deleted", {
        messageId: deletedMessageId
      });
    }

    return res.status(200).json({
      message: "Message deleted successfully",
      messageId: deletedMessageId
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid message ID"
      });
    }

    console.error("Delete message error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
