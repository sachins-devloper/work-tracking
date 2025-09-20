# Team Daily Activity Tracker

A full-stack web application for tracking team daily activities with React frontend and Node.js backend.

## Project Structure

```
team-activity-tracker/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── config/             # Database configuration
│   └── server.js           # Main server file
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── package.json           # Root package.json
```

## Features

- **Authentication**: JWT-based login system
- **User Management**: Admin can create users (admin/member roles)
- **Activity Tracking**: Team members can add/view daily activities
- **Admin Dashboard**: Monitor all team activities
- **Search/Filter**: Filter activities by date
- **Responsive Design**: Built with TailwindCSS

## Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Deployment**: Render.com

## Getting Started

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
```bash
# Backend .env
MONGODB_URI=mongodb+srv://sachin:student123@cluster0.pgfrxp6.mongodb.net
JWT_SECRET=secret#text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

3. Run development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Render.com with both frontend and backend in the same repository.
