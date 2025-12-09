# 🚀 VERCEL DEPLOYMENT - QUICK START GUIDE

## ✅ What Was Done

Your project has been **fully restructured** and **optimized** for Vercel deployment:

### 🔧 Changes Made:

1. **Backend Converted to Serverless**
   - ✅ `server.js` → `api/index.js` (Vercel-compatible serverless function)
   - ✅ MongoDB connection caching added for performance
   - ✅ Express routes work seamlessly

2. **Frontend Restructured**
   - ✅ Moved to `client/` directory
   - ✅ Vite config optimized for production build
   - ✅ Code splitting configured (React, Three.js, Animation libraries)

3. **Vercel Configuration**
   - ✅ `vercel.json` created with routing rules
   - ✅ API routes configured (`/api/*`)
   - ✅ SPA routing for frontend
   - ✅ Security headers added

4. **Environment Variables**
   - ✅ `.env.vercel` - Guide for Vercel dashboard setup
   - ✅ `.env.example` - Updated for local development
   - ✅ CORS configured for production domain

5. **Build Optimization**
   - ✅ Production build scripts added
   - ✅ Package.json updated for Vercel
   - ✅ Dependencies separated (client vs root)

---

## 🎯 DEPLOY NOW - 3 Steps

### Step 1: Push to GitHub
```powershell
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Import your GitHub repository
3. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables
Add these 3 variables in Vercel Dashboard:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `FRONTEND_URL` | `https://your-project.vercel.app` (update after deploy) |
| `NODE_ENV` | `production` |

**Then click DEPLOY!** ✨

---

## 📂 New Project Structure

```
landing-page/
├── api/
│   └── index.js                    ← Your Express backend (serverless)
├── client/
│   ├── src/                        ← React frontend
│   ├── public/
│   ├── index.html
│   ├── package.json                ← Frontend dependencies
│   └── vite.config.js
├── .env.vercel                     ← Environment variables guide
├── .env.example                    ← Local dev template
├── package.json                    ← Root config
├── vercel.json                     ← Vercel deployment config
├── .vercelignore                   ← Files to exclude from deploy
├── VERCEL_DEPLOYMENT.md            ← Full deployment guide
└── QUICKSTART.md                   ← This file
```

---

## 🔗 API Endpoints (After Deploy)

Your backend will be available at:

```
https://your-project.vercel.app/api/health          ← Health check
https://your-project.vercel.app/api/register        ← Registration POST
https://your-project.vercel.app/api/registrations   ← Get all (Admin)
https://your-project.vercel.app/api/registrations/:id ← Update status (Admin)
```

---

## ⚡ What Changed in Your Code

### Backend (`api/index.js`)
- ✅ Added connection caching (prevents MongoDB timeouts)
- ✅ Updated CORS to use `process.env.FRONTEND_URL`
- ✅ Changed `app.listen()` to `export default app` (required by Vercel)
- ✅ Added serverless-friendly error handling

### Frontend (No changes needed!)
- ✅ Your React code works as-is
- ✅ Vite proxy configured for local dev
- ✅ Production API calls will use Vercel domain

### Package.json
- ✅ Build script updated: `cd client && npm install && npm run build`
- ✅ Separated client dependencies

---

## 🧪 Test Locally Before Deploy

```powershell
# 1. Install dependencies
npm install
cd client
npm install
cd ..

# 2. Setup environment
Copy-Item .env.example .env
# Edit .env with your MongoDB URI

# 3. Run development servers
npm run dev:all

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

---

## ⚠️ Important Notes

### MongoDB Atlas Setup Required
You MUST use MongoDB Atlas (cloud database). Vercel cannot connect to local MongoDB.

**Setup MongoDB Atlas:**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Add database user
4. **Whitelist all IPs: `0.0.0.0/0`** (required for Vercel)
5. Get connection string

### Update FRONTEND_URL After Deploy
After first deployment, update the `FRONTEND_URL` environment variable in Vercel with your actual domain, then **redeploy**.

---

## 🐛 Common Issues

**Issue**: "Cannot connect to MongoDB"
- ✅ Verify `MONGODB_URI` is correct
- ✅ Check `0.0.0.0/0` is whitelisted in Atlas

**Issue**: "CORS error"
- ✅ Update `FRONTEND_URL` with actual Vercel domain
- ✅ Redeploy after updating

**Issue**: "API endpoint not found"
- ✅ Verify `api/index.js` exists
- ✅ Check `vercel.json` routing config

---

## 📚 Full Documentation

For complete deployment guide with troubleshooting, see:
👉 **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**

---

## ✨ Next Steps After Deployment

1. Test all API endpoints
2. Verify registration form works
3. Check data in MongoDB Atlas
4. Set up custom domain (optional)
5. Monitor with Vercel Analytics

---

**🎉 Your project is ready to deploy! Follow the 3 steps above and you'll be live in minutes.**

**Questions? Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting.**
