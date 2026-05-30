# Chatify

Chatify is a real-time, full-stack chat application designed to seamlessly blend simplicity with innovation. It features instant messaging, secure user authentication, online status tracking, and a responsive UI, allowing users to connect and chat without friction.

## Key Features

* **Real-Time Messaging:** Instant message delivery and reception powered by Socket.io.
* **Secure Authentication:** User signup and login with hashed passwords (bcrypt) and protected routes using JSON Web Tokens (JWT).
* **User Presence:** Real-time online/offline status updates and "last seen" tracking.
* **Optimized Performance:** Frontend utilizes React `lazy` and `Suspense` for efficient component rendering and code splitting.
* **Responsive Design:** Mobile-friendly user interface optimized for varying viewport heights.
* **Search & Add Users:** Easily search for existing users and add them to your contact list to initiate new conversations.
* **Persistent Storage:** All users, contacts, and chat histories are securely stored in a MongoDB database.

---

## Tech Stack

### Frontend

* **Library:** React.js
* **Routing:** React Router DOM
* **Styling:** Tailwind CSS (via utility classes)
* **Real-time Client:** Socket.io-client

### Backend

* **Environment:** Node.js
* **Framework:** Express.js
* **Real-time Server:** Socket.io
* **Database:** MongoDB (Native MongoDB Driver)
* **Authentication & Security:** JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), CORS

---

## Project Structure

While you can organize the repository as you see fit, a standard separation of client and server is recommended:

```text
chatify/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (chatapp, login, signup, etc.)
│   │   ├── App.js          # Main Application Routing
│   │   └── App.css         # Global Styles
│   └── package.json
└── server/                 # Node/Express Backend
    ├── controllers/        # Route logic (chatifyController, userController, authController, socket)
    ├── routes/             # Express routes (chatifyRoutes)
    ├── utils/              # Helper functions (db, idGenerator, timeStamp)
    ├── index.js            # Entry point
    └── package.json

```

---

## Environment Variables

To run this project, you will need to add the following environment variables to a `.env` file in your **backend (server)** directory:

| Variable | Description |
| --- | --- |
| `PORT` | The port the backend server will run on (e.g., `2000`). |
| `MONGODB_URI` | Your MongoDB connection string. |
| `SECRET_KEY` | A secure, random string used to sign JSON Web Tokens. |

*Note: On the frontend, the `baseUri` is currently hardcoded. For production, consider moving this to a `.env` file in the React app (e.g., `REACT_APP_BASE_URI`).*

---

## Installation & Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

* Node.js installed on your machine
* A MongoDB database (local or MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/Rithesh-S/chatify.git
cd chatify

```

### 2. Backend Setup

Navigate to the server directory, install dependencies, and start the development server.

```bash
cd server
npm install
# Ensure your .env file is created here with the required variables
npm start

```

*The server should now be running on `http://localhost:2000`.*

### 3. Frontend Setup

Open a new terminal window, navigate to the client directory, install dependencies, and start the React application.

```bash
cd client
npm install
npm start

```

*The application should now be accessible in your browser.*

---

## API Endpoints Overview

**Authentication & Users**

* `POST /chatify/signup` - Register a new user.
* `POST /chatify/login` - Authenticate a user and return a JWT.
* `GET /chatify/auth` - Verify the user's JWT.

**Chat & Contacts**

* `POST /chatify/chatapp/user` - Retrieve a user's ID by username.
* `PUT /chatify/chatapp/addmember` - Add a new user to contacts.
* `POST /chatify/chatapp/chatuserlist` - Fetch a user's contact list.

**Status Updates**

* `PUT /chatify/statusupdate` - Update online/offline status and last seen timestamp.
* `GET /chatify/checkstatus` - Retrieve the status of users.
* `PUT /chatify/updatesocket` - Update the user's active Socket.io ID.
