# Quick Start: Deploy to Netlify & Render

## 🚀 TL;DR - 5 Steps

### Step 1: MongoDB Atlas Setup (5 min)
1. Go to https://mongodb.com/cloud/atlas
2. Create account → Create cluster (free)
3. Add IP: Network Access → "Allow from anywhere"
4. Create DB user: Database Access
5. Connect → Copy connection string

### Step 2: Render Backend (10 min)
1. Go to https://render.com
2. New → Web Service → Connect GitHub
3. Select repo, set Root Directory to `backend`
4. Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/community-bulletin?retryWrites=true&w=majority
   JWT_SECRET=your-random-secret-key
   FRONTEND_URL=https://your-app.netlify.app
   ```
5. Deploy → Wait 2-3 min → Copy backend URL

### Step 3: Netlify Frontend (5 min)
1. Go to https://netlify.com
2. New → Connect Git → Select repo
3. Base directory: `frontend`
4. Build command: `npm run build`
5. Publish: `dist`
6. Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
7. Deploy → Done! ✅

### Step 4: Update Backend CORS (1 min)
- Go to Render dashboard
- Update FRONTEND_URL to your Netlify URL
- Trigger redeploy

### Step 5: Test
- Visit your Netlify URL
- Register a user
- Create a post
- Done!

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Frontend can't connect to backend | Check `VITE_API_URL` is correct in Netlify env vars |
| Backend won't start | Check MongoDB URI in Render env vars |
| CORS errors in browser | Make sure backend FRONTEND_URL matches your Netlify URL |
| Build fails on Netlify | Run `npm run build` locally to check for errors |
| Build fails on Render | Check Node version compatibility, verify all dependencies in package.json |

---

## Production URLs

After deployment:
- **Frontend**: https://your-app-name.netlify.app
- **Backend**: https://your-app-name.onrender.com
- **Backend Health Check**: https://your-app-name.onrender.com/health

---

## Advanced Troubleshooting

For detailed troubleshooting, see `DEPLOYMENT_GUIDE.md`
