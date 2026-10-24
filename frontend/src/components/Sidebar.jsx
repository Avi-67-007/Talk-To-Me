
import { useEffect, useState } from "react";
import api from "../services/api";

const Sidebar = ({ selectedUser, onSelectUser, currentUser, onlineUsers }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load users"
        );
      }
    };

    fetchUsers();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div>
          <h2>Talk-To-Me</h2>
          <p>Logged in as {currentUser?.name}</p>
        </div>
      </div>

      <h3 className="sidebar-title">People</h3>

      {error && <p className="error-message">{error}</p>}

      <div className="user-list">
        {users.map((user) => (
          <button
            key={user._id}
            className={`user-item ${
              selectedUser?._id === user._id ? "selected" : ""
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="avatar">
              {(user.name || "?").charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user.name}</strong>
              <span>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>

            <span
              className={`status-dot ${
                onlineUsers.includes(user._id) ? "online" : ""
              }`}
            />
          </button>
        ))}

        {!error && users.length === 0 && (
          <p className="empty-users">No other users found.</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
