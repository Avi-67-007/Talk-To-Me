# 💬 Talk-To-Me — Real-Time Chat Application

**Talk-To-Me** is a full-stack real-time messaging application built using the MERN stack and Socket.IO. It enables users to create accounts, log in securely, discover other users, and exchange messages instantly through a clean, responsive chat interface.

🌐 **Live Application:** https://talk-to-me-h3au.vercel.app  
🎥 **Demo Video:** [Watch Talk-To-Me Demo](https://drive.google.com/file/d/1zpLrcrJe-Yj9iqWqtq38jz1uIs8iv6zp/view?usp=sharing)  
📦 **GitHub Repository:** https://github.com/Avi-67-007/Talk-To-Me  
⚙️ **Backend Service:** https://talk-to-me-backend-kryk.onrender.com

---

## 📌 Problem Statement

Communication applications need to provide a simple and reliable way for users to find other people and exchange messages. Traditional request-based interactions alone do not provide the immediate feedback expected from a real-time chat experience.

Talk-To-Me addresses this problem by combining secure user authentication, persistent message storage, user discovery, and real-time communication in one web application.

The project also explores how a frontend, backend API, database, and WebSocket-based communication layer work together in a deployed full-stack application.

## 🎯 Target Users

Talk-To-Me is designed for users who need a straightforward messaging experience, including:

- Individuals who want to communicate with other registered users.
- Friends and small communities who need direct conversations.
- Developers learning how authentication, persistent storage, and real-time communication work together.

## 💡 Solution

Talk-To-Me provides an account-based messaging experience. Users register or log in, view the available users, select someone to chat with, and exchange messages in real time.

The application uses a React frontend, an Express and Node.js backend, MongoDB for persistent data, and Socket.IO for live communication.

Rather than being only a visual prototype, Talk-To-Me connects its main workflows to a deployed backend and database.

## ✨ Key Features

### 🔐 Authentication
- User registration and login.
- Password hashing using bcryptjs.
- JSON Web Token (JWT)-based authentication.
- Protected API requests and authenticated Socket.IO connections.

### 💬 Real-Time Messaging
- Send and receive messages through Socket.IO.
- Deliver new messages to connected recipients without manually refreshing the page.
- Store message data in MongoDB so conversations can persist.
- Select users from the people list to start conversations.

### 🟢 Online Presence
- Track connected users through Socket.IO.
- Broadcast online-user updates to connected clients.
- Display user availability in the chat interface.

### ⌨️ Typing Indicators
- Send typing-start and typing-stop events.
- Notify the other participant when a user is typing.

### 🌐 Deployed Full-Stack Application
- React frontend hosted on Vercel.
- Node.js backend hosted on Render.
- MongoDB Atlas for database hosting.
- Production API and Socket.IO connections configured for the deployed frontend.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | CSS |
| Routing | React Router |
| HTTP Requests | Axios |
| Real-Time Communication | Socket.IO Client, Socket.IO |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Configuration | dotenv, environment variables |
| Version Control | Git, GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## 🏗️ System Architecture

```text
                 ┌─────────────────────────┐
                 │       User / Browser    │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    React + Vite         │
                 │    Frontend on Vercel   │
                 └────────────┬────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
       ┌──────────────────┐     ┌──────────────────┐
       │  REST API        │     │  Socket.IO       │
       │  Axios / HTTP    │     │  Real-Time Events│
       └────────┬─────────┘     └────────┬─────────┘
                │                        │
                └────────────┬───────────┘
                             ▼
                 ┌─────────────────────────┐
                 │   Node.js + Express     │
                 │   Backend on Render     │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      MongoDB Atlas      │
                 │  Users and Messages     │
                 └─────────────────────────┘
```

### How the Application Works

1. A user registers or logs in through the React frontend.
2. The backend validates the request and uses MongoDB to access or store user information.
3. The server issues a JWT after successful authentication.
4. Axios sends API requests to the backend, including the JWT when authentication is required.
5. Socket.IO establishes an authenticated real-time connection using the user's token.
6. Message events and online-presence updates are delivered to connected clients.
7. Message data is stored in MongoDB through the backend's messaging workflow.

## 📁 Project Structure

```text
Talk-To-Me/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── message.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── index.js
│   ├── socket.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── services/
│   │       ├── api.js
│   │       └── socket.js
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run Talk-To-Me locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm
- A MongoDB database, such as [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Avi-67-007/Talk-To-Me.git
cd Talk-To-Me
```

### 2. Configure the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
dbURL=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Replace the example values with your own configuration. Use a strong, private JWT secret and a valid MongoDB connection string.

Start the backend:

```bash
npm run dev
```

The backend should start at:

http://localhost:5000

### 3. Configure the Frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown in the terminal. It is usually:

http://localhost:5173

### 4. Test the Main Workflow

1. Open the application and register a user account.
2. Log in with the account.
3. Open a second browser session and log in as another user.
4. Select a user from the people list.
5. Send messages between the two accounts.
6. Verify that messages and online-status updates appear in real time.

## 🔑 Environment Variables

### Backend

| Variable | Purpose |
|---|---|
| `PORT` | Port used by the backend locally; Render supplies its own port in production. |
| `dbURL` | MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign and verify JWTs. |
| `CLIENT_URL` | Frontend origin allowed by the production CORS configuration. |

### Frontend

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API and Socket.IO server. |

**Security note:** Never commit `.env` files, database credentials, or JWT secrets to GitHub. The frontend's `VITE_API_URL` is a public URL, not a secret.

## 🚀 Deployment

### Frontend — Vercel

The frontend is deployed at:

https://talk-to-me-h3au.vercel.app

Configure the Vercel project to use the `frontend` directory as its root directory.

Set the environment variable:

```env
VITE_API_URL=https://talk-to-me-backend-kryk.onrender.com
```

Redeploy the frontend whenever this variable changes so the updated value is included in the build.

### Backend — Render

The backend is deployed at:

https://talk-to-me-backend-kryk.onrender.com

Configure the backend environment variables in Render:

```env
dbURL=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://talk-to-me-h3au.vercel.app
NODE_ENV=production
```

Render supplies the `PORT` environment variable to the running service. Keep database credentials and signing secrets private.

The Express and Socket.IO CORS configurations must allow the deployed frontend origin.

### Database — MongoDB Atlas

MongoDB Atlas stores application data. Configure a valid database connection string in the backend environment. Ensure that the database user's permissions and network access settings permit the deployed backend to connect.

## 🔐 Security Considerations

- Passwords are hashed before storage.
- JWTs authenticate protected API requests and Socket.IO connections.
- Database credentials and signing secrets are stored in environment variables.
- CORS is configured to allow the intended frontend origin.
- Private environment files must remain outside version control.

## 🧪 Testing the Application

The primary end-to-end workflow is:

**Register → Login → Discover Users → Start a Conversation → Exchange Messages in Real Time**

Testing with two separate browser sessions helps verify that messages are delivered to the intended recipient rather than only appearing in the sender's interface.

The deployed application should also be tested for authentication errors, failed network requests, and initial connection delays.

## 🎥 Demo Video

Watch the demonstration of Talk-To-Me, including the main user workflows and real-time messaging:

**[▶️ Watch Talk-To-Me Demo on Google Drive](https://drive.google.com/file/d/1zpLrcrJe-Yj9iqWqtq38jz1uIs8iv6zp/view?usp=sharing)**

The video demonstrates the deployed application and its real-time communication workflow.

## 🎯 Project Goals and Engineering Decisions

Talk-To-Me was built to explore the complete lifecycle of a full-stack software application:

- Designing a product around a clear user workflow.
- Implementing authentication and persistent data.
- Integrating REST APIs with real-time communication.
- Managing frontend and backend configuration.
- Debugging deployment, API URL, and CORS issues.
- Deploying the application and verifying real-world functionality.

The project prioritizes a small set of connected workflows rather than a large collection of unrelated features.

## 🔮 Future Improvements

Potential improvements include:

- Message deletion and editing.
- User profile pictures and profile customization.
- Unread-message indicators.
- Message search and conversation history enhancements.
- Stronger input validation and rate limiting.
- Improved accessibility and mobile usability.

These are planned improvements, not claims that every feature is currently implemented.

## 👨‍💻 Author

**GitHub:** [Avi-67-007](https://github.com/Avi-67-007)

## 📄 License

No license has been specified for this repository yet. Add a `LICENSE` file if you intend to distribute the project under an open-source license.

---

**Talk-To-Me — Built with React, Node.js, MongoDB, Express, and Socket.IO.**
