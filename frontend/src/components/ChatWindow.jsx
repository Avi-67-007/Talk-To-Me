
import { useEffect, useState } from "react";
import api from "../services/api";

const ChatWindow = ({ currentUser, selectedUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [typingUser, setTypingUser] = useState(false);
  const [typing, setTyping] = useState(false);

  // Load conversation history
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const fetchMessages = async () => {
      setMessages([]);
      setError("");
      setTypingUser(false);

      try {
        const response = await api.get(
          `/messages/${selectedUser._id}`
        );

        if (!cancelled) setMessages(response.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Could not load messages"
          );
        }
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedUser]);

  // Listen for new messages and deletion events
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const me = String(currentUser.id);
    const other = String(selectedUser._id);

    const handleNewMessage = (message) => {
      const senderId = String(message.senderId);
      const receiverId = String(message.receiverId);

      const belongsToConversation =
        (senderId === me && receiverId === other) ||
        (senderId === other && receiverId === me);

      if (belongsToConversation) {
        setMessages((prev) => {
          if (prev.some((item) => item._id === message._id)) {
            return prev;
          }

          return [...prev, message];
        });
      }
    };

    const handleMessageDeleted = ({ messageId } = {}) => {
      if (!messageId) return;

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:deleted", handleMessageDeleted);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:deleted", handleMessageDeleted);
    };
  }, [socket, currentUser.id, selectedUser?._id]);

  // Listen for typing indicator
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTyping = ({ userId, isTyping } = {}) => {
      if (String(userId) === String(selectedUser._id)) {
        setTypingUser(Boolean(isTyping));
      }
    };

    socket.on("user:typing", handleTyping);

    return () => {
      socket.off("user:typing", handleTyping);
      setTypingUser(false);
    };
  }, [socket, selectedUser?._id]);

  // Send typing status
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!selectedUser || !socket) return;

    if (value.trim() && !typing) {
      setTyping(true);
      socket.emit("typing:start", {
        receiverId: selectedUser._id
      });
    }

    if (!value.trim() && typing) {
      setTyping(false);
      socket.emit("typing:stop", {
        receiverId: selectedUser._id
      });
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();

    const messageText = text.trim();

    if (!messageText || !selectedUser) return;

    if (typing) {
      socket.emit("typing:stop", {
        receiverId: selectedUser._id
      });
      setTyping(false);
    }

    setText("");
    setError("");

    try {
      const response = await api.post("/messages", {
        receiverId: selectedUser._id,
        text: messageText
      });

      const savedMessage = response.data.data;

      setMessages((prev) => {
        if (prev.some((item) => item._id === savedMessage._id)) {
          return prev;
        }

        return [...prev, savedMessage];
      });

      socket.emit("message:send", {
        receiverId: selectedUser._id,
        message: savedMessage
      });
    } catch (err) {
      setText(messageText);
      setError(
        err.response?.data?.message || "Could not send message"
      );
    }
  };

  // Delete your own message
  const deleteMessage = async (messageId) => {
    if (
      !window.confirm("Are you sure you want to delete this message?")
    ) {
      return;
    }

    setDeletingId(messageId);
    setError("");

    try {
      await api.delete(`/messages/${messageId}`);

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );

      // Notify the recipient; backend relay will be added next
      socket.emit("message:delete", {
        receiverId: selectedUser._id,
        messageId
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not delete message"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (!selectedUser) {
    return (
      <main className="chat-empty">
        <div className="empty-icon">💬</div>
        <h2>Your conversations start here</h2>
        <p>Select someone from the sidebar to start chatting.</p>
      </main>
    );
  }

  return (
    <main className="chat-window">
      <header className="chat-header">
        <div className="avatar">
          {(selectedUser.name || "?").charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{selectedUser.name}</h2>
          <p>
            {typingUser
              ? `${selectedUser.name} is typing...`
              : `Conversation with ${selectedUser.name}`}
          </p>
        </div>
      </header>

      <div className="messages">
        {messages.map((message) => {
          const isMine =
            String(message.senderId) === String(currentUser.id);

          return (
            <div
              key={message._id}
              className={`message-row ${isMine ? "mine" : "theirs"}`}
            >
              <div className="message-bubble">
                <p>{message.text}</p>

                <div className="message-meta">
                  <time>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </time>

                  {isMine && (
                    <button
                      type="button"
                      className="delete-message-btn"
                      onClick={() => deleteMessage(message._id)}
                      disabled={deletingId === message._id}
                      aria-label="Delete message"
                      title="Delete message"
                    >
                      {deletingId === message._id ? "..." : "🗑"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {typingUser && (
        <div className="typing-indicator">
          {selectedUser.name} is typing...
        </div>
      )}

      {error && <p className="chat-error">{error}</p>}

      <form className="message-form" onSubmit={sendMessage}>
        <input
          value={text}
          onChange={handleTextChange}
          placeholder={`Message ${selectedUser.name}...`}
          aria-label="Message"
        />

        <button type="submit" disabled={!text.trim()}>
          Send
        </button>
      </form>
    </main>
  );
};

export default ChatWindow;
