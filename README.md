# Community Bulletin Board

A full-stack community bulletin board application built with Node.js, Express, React, and MongoDB. Users can post announcements, events, jobs, and connect with their community through comments and interactions.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Post Management**: Create, read, update, delete posts across different categories
- **Comments System**: Nested comments with replies
- **Categories**: Events, Jobs, Alerts, Lost & Found, General, Services
- **Search & Filter**: Search posts and filter by category
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Activity Logging**: Track user activities and system events

## 🏗️ Architecture

### Database Architecture (MongoDB Only)

**MongoDB (Document Database)**:
- User authentication and profiles with role-based permissions
- Posts with flexible content structure
- Comments with nested reply structure
- Activity logs for user behavior tracking
- All data stored in a single, scalable MongoDB database

### Backend Structure
```
backend/
├── config/          # Database connections
├── controllers/     # Route handlers
├── middleware/      # Auth, validation, etc.
├── models/          # Database models
│   └── mongo/       # MongoDB schemas
├── routes/          # API routes
└── server.js        # Main application file
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── services/    # API service layer
│   ├── contexts/    # React contexts
│   └── ...
└── ...
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Document database for all data
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date formatting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd community-bulletin-board
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration (MongoDB only)
MONGODB_URI=mongodb://localhost:27017/community-bulletin

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here_change_in_production
JWT_REFRESH_EXPIRES_IN=30d
```

**Security Note**: Never commit your `.env` file to version control. The JWT secrets should be long, random strings in production.

#### Database Setup

**MongoDB Setup:**
MongoDB will create the database and collections automatically when the application starts. Make sure MongoDB is running on `localhost:27017` (default) or update the `MONGODB_URI` in your `.env` file.

#### Start Backend Server
```bash
npm run dev
```
The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration (Optional)
Create a `.env.local` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (when implemented)
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Database Migrations

The application uses Mongoose for MongoDB schema management. Models are automatically created when the application starts.

### API Documentation

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

#### Post Endpoints
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

#### Comment Endpoints
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments/:postId` - Create comment (protected)
- `PUT /api/comments/:commentId` - Update comment (protected)
- `DELETE /api/comments/:commentId` - Delete comment (protected)

## 🧪 Testing

### Manual Testing

1. **Register a new account** at `/register`
2. **Login** with your credentials at `/login`
3. **Create a post** using the "Create Post" button
4. **Browse posts** on the home page
5. **View post details** by clicking on any post
6. **Add comments** to posts
7. **Reply to comments**
8. **Visit your dashboard** to manage posts

### Sample Data

The application will automatically create default roles and users. You can create additional test data through the UI.

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Configure production database URLs
3. Use a process manager like PM2
4. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Serve static files from the `dist` directory
3. Configure your web server to serve the built files

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation on all inputs
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers middleware

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment configuration
3. Ensure databases are running and accessible
4. Check the network connectivity between frontend and backend

## 📝 Future Enhancements

- [ ] Image upload for posts
- [ ] Email notifications
- [ ] Admin moderation panel
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Post expiration management
- [ ] User reputation system
- [ ] Social media integration
