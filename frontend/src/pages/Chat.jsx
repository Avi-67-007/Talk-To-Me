
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import socket from "../services/socket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const Chat = () => {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.auth = {
      token: localStorage.getItem("token")
    };

    socket.on("users:online", handleOnlineUsers);
    socket.connect();

    return () => {
      socket.off("users:online", handleOnlineUsers);
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <div className="chat-layout">
      <Sidebar
        currentUser={user}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onlineUsers={onlineUsers}
      />

      <div className="chat-main">
        <div className="chat-topbar">
          <span>Talk-To-Me</span>
          <button onClick={logout}>Logout</button>
        </div>

        <ChatWindow
          currentUser={user}
          selectedUser={selectedUser}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default Chat;
