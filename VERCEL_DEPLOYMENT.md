# 🚀 Meduhub - Vercel Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Pre-Deployment Setup](#pre-deployment-setup)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing Your Deployment](#testing-your-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Backend Limitations on Vercel](#backend-limitations)
9. [Local Development](#local-development)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
- [ ] **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- [ ] **Git Repository** - Your code pushed to GitHub/GitLab/Bitbucket
- [ ] **Node.js 18+** installed locally

---

## 📁 Project Structure

Your project has been restructured for Vercel deployment:

```
landing-page/
├── api/
│   └── index.js              ← Backend serverless function (Express → Vercel)
├── client/
│   ├── src/                  ← React frontend source
│   ├── public/               ← Static assets
│   ├── index.html            ← HTML entry point
│   ├── package.json          ← Frontend dependencies
│   └── vite.config.js        ← Vite build config
├── .env.example              ← Local development environment template
├── .env.vercel               ← Vercel environment variables guide
├── package.json              ← Root package.json (for Vercel)
├── vercel.json               ← Vercel deployment configuration
└── VERCEL_DEPLOYMENT.md      ← This file
```

**Key Changes:**
- ✅ Express server converted to serverless function (`api/index.js`)
- ✅ Frontend moved to `client/` directory
- ✅ MongoDB connection caching added for performance
- ✅ CORS configured for production domain
- ✅ Vercel routing configured

---

## 🔧 Pre-Deployment Setup

### Step 1: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster (M0 Sandbox)

2. **Create Database User**
   - Go to **Database Access** → Add New Database User
   - Username: `meduhub-admin` (or your choice)
   - Password: Generate a strong password
   - **Save these credentials!**

3. **Whitelist All IPs (for Vercel)**
   - Go to **Network Access** → Add IP Address
   - **Add**: `0.0.0.0/0` (allows access from anywhere)
   - ⚠️ This is required for Vercel serverless functions

4. **Get Connection String**
   - Go to **Database** → Connect → Drivers
   - Select **Node.js** driver
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://meduhub-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/meduhub?retryWrites=true&w=majority`

---

### Step 2: Push Code to Git Repository

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/meduhub.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click **"Import Project"**

2. **Import Git Repository**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Vercel access
   - Select `meduhub` repository

3. **Configure Project**
   - **Project Name**: `meduhub` (or your choice)
   - **Framework Preset**: `Other`
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add these three variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/meduhub` | Production, Preview, Development |
   | `FRONTEND_URL` | `https://meduhub.vercel.app` (update after deploy) | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production, Preview, Development |

   ⚠️ **Important**: Leave `FRONTEND_URL` as placeholder for now. We'll update it after first deployment.

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - ✅ Your app is now live!

---

### Method 2: Via Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd "C:\Users\dipus\Desktop\New folder\landing-page"
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? meduhub
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI
# Paste your MongoDB connection string when prompted
# Select: Production, Preview, Development

vercel env add FRONTEND_URL
# Enter: https://your-project.vercel.app (update after deploy)
# Select: Production, Preview, Development

vercel env add NODE_ENV
# Enter: production
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

---

## ⚙️ Post-Deployment Configuration

### Update FRONTEND_URL

After your first deployment, you'll get a URL like:
```
https://meduhub-xyz123abc.vercel.app
```

**Update the FRONTEND_URL environment variable:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Find `FRONTEND_URL` → Click **Edit**
4. Update to your actual domain: `https://meduhub-xyz123abc.vercel.app`
5. Click **Save**
6. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **"⋯"** on latest deployment → **"Redeploy"**

This ensures CORS works correctly for your production domain.

---

## 🧪 Testing Your Deployment

### 1. Test Health Check
```bash
curl https://your-project.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Meduhub API is running on Vercel",
  "timestamp": "2025-12-09T...",
  "environment": "production"
}
```

### 2. Test Registration API
```bash
curl -X POST https://your-project.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9876543210",
    "email": "test@example.com",
    "state": "Maharashtra",
    "city": "Mumbai",
    "inquiryType": "register"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration submitted successfully!",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 3. Test Frontend
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Fill out the registration form
3. Submit and verify success message
4. Check MongoDB Atlas → Browse Collections → Verify data is saved

---

## 🐛 Troubleshooting

### Issue: "API endpoint not found"
**Solution:**
- Verify `vercel.json` routing configuration
- Check API function is in `api/index.js`
- Redeploy: `vercel --prod`

### Issue: "MongoDB connection timeout"
**Solution:**
- Verify `MONGODB_URI` is correct in Vercel env vars
- Ensure `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access
- Check MongoDB user has correct permissions

### Issue: CORS Error
**Solution:**
- Update `FRONTEND_URL` environment variable with actual Vercel domain
- Redeploy application
- Clear browser cache and test again

### Issue: "500 Internal Server Error"
**Solution:**
1. View Vercel function logs:
   - Go to **Deployments** → Click on latest deployment
   - Click **"Functions"** tab → Select `/api/index`
   - Check logs for error details
2. Common causes:
   - Missing environment variables
   - Invalid MongoDB URI
   - Code syntax errors

### Issue: Build Fails
**Solution:**
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure Node.js version compatibility (use Node 18+)
- Try building locally: `cd client && npm run build`

### View Logs
```powershell
# View real-time logs
vercel logs your-project.vercel.app --follow

# View function logs for API
vercel logs your-project.vercel.app --since 1h
```

---

## ⚠️ Backend Limitations on Vercel Serverless

### ❌ What WON'T Work:

1. **WebSockets** - Real-time bidirectional connections
   - **Alternative**: Use Vercel Edge Functions + Pusher/Ably/Socket.io on separate service

2. **Long-Running Tasks** (>10s on Hobby, >60s on Pro)
   - **Alternative**: Use background job services (Bull/Redis, AWS Lambda, Vercel Cron Jobs)

3. **File System Writes** - Cannot write persistent files
   - **Alternative**: Use cloud storage (AWS S3, Cloudinary, Vercel Blob)

4. **Stateful Operations** - No persistent memory between requests
   - **Alternative**: Use external cache (Redis, Vercel KV)

5. **Background Jobs** - No continuous processes
   - **Alternative**: Vercel Cron Jobs for scheduled tasks

### ✅ What WILL Work (Your Current Setup):

- ✅ REST API endpoints (GET, POST, PATCH, DELETE)
- ✅ MongoDB connections (with connection caching)
- ✅ Express middleware
- ✅ CORS configuration
- ✅ Request/response handling
- ✅ Data validation
- ✅ Database queries
- ✅ JSON responses

**Your application is fully compatible with Vercel!** 🎉

---

## 💻 Local Development

### Setup Local Environment

```powershell
# 1. Install dependencies (root)
npm install

# 2. Install client dependencies
cd client
npm install
cd ..

# 3. Create .env file
Copy-Item .env.example .env

# 4. Edit .env with your MongoDB URI
notepad .env
```

### Run Development Servers

**Option 1: Run Both (Frontend + Backend)**
```powershell
npm run dev:all
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Option 2: Run Separately**
```powershell
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend:dev
```

### Test Local Backend
```powershell
# Health check
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/register `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Local Test",
    "phone": "9876543210",
    "email": "local@test.com",
    "state": "Maharashtra",
    "city": "Mumbai"
  }'
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

```powershell
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel automatically:
# 1. Detects the push
# 2. Builds your project
# 3. Deploys to production
# 4. Updates your live URL
```

**Branch Previews:**
- Push to `main` → Production deployment
- Push to other branches → Preview deployment (unique URL)

---

## 📊 Monitoring & Analytics

### View Vercel Analytics
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Analytics** tab
4. View:
   - Page views
   - API request counts
   - Response times
   - Error rates

### MongoDB Monitoring
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Select your cluster → **Metrics**
3. Monitor:
   - Database connections
   - Query performance
   - Storage usage

---

## 🔐 Security Best Practices

### Current Setup ✅
- [x] CORS configured for specific origins
- [x] Environment variables secured
- [x] MongoDB connection string hidden
- [x] Security headers added (X-Frame-Options, etc.)
- [x] Input validation on backend

### Future Enhancements (Optional)
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add API authentication for admin routes
- [ ] Add request logging (Winston, Morgan)
- [ ] Add monitoring (Sentry for error tracking)
- [ ] Add database backups automation

---

## 📞 Support & Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 Deployment Checklist

Before going live, verify:

- [ ] MongoDB Atlas cluster created and configured
- [ ] Network access set to `0.0.0.0/0` in Atlas
- [ ] All environment variables added in Vercel
- [ ] `FRONTEND_URL` updated with actual Vercel domain
- [ ] Health check API responds successfully
- [ ] Registration form works end-to-end
- [ ] Data appears in MongoDB Atlas
- [ ] CORS works from production domain
- [ ] No console errors in browser
- [ ] Mobile responsiveness tested

---

**🚀 You're ready to deploy! Follow the steps above and your Meduhub application will be live on Vercel in minutes.**

**Need help? Check the troubleshooting section or Vercel documentation.**

---

**Last Updated**: December 9, 2025  
**Project**: Meduhub Landing Page  
**Stack**: React + Vite + Express (Serverless) + MongoDB Atlas + Vercel
