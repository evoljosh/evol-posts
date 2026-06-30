# EVOL Posts — Full-Stack Web Application

A simple full-stack app where users can sign up, log in, and create/view/delete posts.
Built for the Web Programming 1 Final Project.

## Features
- User signup and login with hashed passwords (bcrypt)
- JWT-based authentication
- Create, read, and delete posts (CRUD)
- Only the post owner can delete their own post
- Responsive frontend built with vanilla HTML, CSS, and JavaScript
- RESTful API built with Node.js + Express
- MongoDB database via Mongoose

## Tech Stack
**Backend:** Node.js, Express.js, MongoDB (Mongoose), bcrypt, jsonwebtoken, dotenv, cors
**Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API), normalize.css

## Project Structure
```
evol-posts/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/auth.controller.js
│   │   ├── controllers/post.controller.js
│   │   ├── middlewares/auth.middleware.js
│   │   ├── middlewares/errorHandler.js
│   │   ├── models/user.model.js
│   │   ├── models/post.model.js
│   │   ├── routes/auth.routes.js
│   │   ├── routes/post.routes.js
│   │   ├── utils/logger.js
│   │   ├── index.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your own values:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — any long random string
4. `npm start`
5. Server runs at `http://localhost:5000`

### Frontend
1. Open `frontend/index.html` with a tool like VS Code Live Server
2. Make sure `API_URL` in `app.js` points to your backend (local or deployed)

## API Endpoints

| Method | Endpoint           | Description                  | Auth Required |
|--------|---------------------|-------------------------------|----------------|
| POST   | /api/auth/signup     | Create a new account          | No             |
| POST   | /api/auth/login      | Log in and receive a token    | No             |
| GET    | /api/posts           | Get all posts                 | No             |
| GET    | /api/posts/:id        | Get a single post             | No             |
| POST   | /api/posts           | Create a new post             | Yes            |
| PUT    | /api/posts/:id        | Update your own post          | Yes            |
| DELETE | /api/posts/:id        | Delete your own post          | Yes            |

## Security Measures
- Passwords are hashed with bcrypt before storing
- JWT tokens are used to authenticate protected routes
- Post ownership is checked before allowing edit/delete
- User input is escaped on the frontend to prevent basic XSS

## Author
Josh & Michaeljr— Final Project, Web Programming 1
