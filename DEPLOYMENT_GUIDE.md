# Deployment Guide - Netlify (Frontend) & Render (Backend)

## Prerequisites
- GitHub account (for version control)
- Netlify account (https://netlify.com)
- Render account (https://render.com)
- MongoDB Atlas account (https://mongodb.com/cloud/atlas) - for cloud database

---

## Part 1: Setup MongoDB Atlas (Cloud Database)

### 1. Create MongoDB Atlas Cluster
1. Go to https://mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project
4. Create a Cluster (choose Free tier)
5. Wait for cluster to deploy (5-10 minutes)

### 2. Get Connection String
1. Click "Connect"
2. Choose "Drivers"
3. Select Node.js version
4. Copy the connection string
5. Save it - you'll need it for Render

### 3. Add IP Whitelist
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for simplicity
4. Confirm

---

## Part 2: Deploy Backend to Render

### 1. Push Code to GitHub
```bash
cd d:\Project11\Project11\backend
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Service
1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Select "Deploy an existing GitHub repository"
4. Select your Project11 repository
5. Configure:
   - **Name**: `community-bulletin-backend` (or your choice)
   - **Root Directory**: `backend` (important!)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Set Environment Variables
In Render dashboard, add these under "Environment":

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-netlify-app.netlify.app
JWT_SECRET=your-super-secure-random-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_PORT=27017
MONGODB_DATABASE=community-bulletin
MONGODB_USER=your-mongodb-username
MONGODB_PASSWORD=your-mongodb-password
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com
EMAIL_VERIFICATION_ENABLED=true
OTP_EXPIRY=10
```

**Note**: To get MongoDB Atlas credentials:
1. In MongoDB Atlas, go to Database Access
2. Create a user with username/password
3. Use these in MONGODB_USER and MONGODB_PASSWORD

### 4. Wait for Deployment
- Render will auto-deploy when you push to GitHub
- Check deployment logs for errors
- Once deployed, you'll get a URL like: `https://community-bulletin-backend.onrender.com`
- **Save this URL** - you'll need it for the frontend

### 5. Test Backend
```
https://your-backend-url.onrender.com/health
```

Should return a JSON response.

---

## Part 3: Deploy Frontend to Netlify

### 1. Create .env.local for Production (Local Testing)
Create `frontend/.env.local`:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Build Locally to Test
```bash
cd d:\Project11\Project11\frontend
npm run build
npm run preview
```
Test at `http://localhost:4173`

### 3. Push to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 4. Connect to Netlify
1. Go to https://netlify.com and sign in
2. Click "Import an existing project"
3. Choose GitHub
4. Select your Project11 repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 5. Set Environment Variables
In Netlify dashboard → Site settings → Environment:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 6. Update Backend CORS
After you get your Netlify URL, update your Render environment variable:
```
FRONTEND_URL=https://your-frontend-site.netlify.app
```
This ensures the backend accepts requests from your frontend.

### 7. Deploy
- Netlify will auto-deploy when you push to GitHub
- Check deployment logs
- Your site will be live at: `https://your-site-name.netlify.app`

---

## Part 4: Update MongoDB Atlas Connection String

Your backend now needs to connect via MongoDB Atlas instead of localhost:

Update your `backend/server.js` or `backend/config/mongo.js` to use the environment variables properly.

Example connection string format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

---

## Troubleshooting

### Frontend Can't Connect to Backend
1. Check that `VITE_API_URL` is set correctly in Netlify
2. Verify backend URL is correct
3. Check browser console for CORS errors
4. Ensure backend CORS includes your Netlify URL

### Backend Not Connecting to MongoDB
1. Verify MongoDB credentials are correct
2. Check IP whitelist in MongoDB Atlas
3. Verify connection string format
4. Check Render logs for connection errors

### Render Backend Goes to Sleep
- Free tier Render services spin down after 15 minutes of inactivity
- They auto-restart when accessed (cold start ~30s)
- Upgrade to paid tier to prevent this

### Build Failures on Netlify/Render
1. Check logs in the dashboard
2. Verify Node version compatibility
3. Ensure all dependencies are listed in package.json
4. Check for environment variables that need to be set

---

## After Deployment

1. Test user registration/login
2. Create a test post
3. Verify email verification works
4. Check activity logs

---

## Quick Reference URLs

After deployment, you'll have:
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-app.onrender.com`
- Backend Health: `https://your-app.onrender.com/health`

---

## Notes

- Update `netlify.toml` `VITE_API_URL` with your actual Render URL
- Update `backend/render.yaml` if using a different structure
- Keep your JWT_SECRET secure and unique
- MongoDB free tier has limits - monitor usage
- Both Netlify and Render free tier have cold start delays
