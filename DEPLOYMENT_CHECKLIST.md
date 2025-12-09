# 📋 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

---

## Pre-Deployment

### ✅ Code Preparation
- [x] Backend converted to serverless (`api/index.js`)
- [x] Frontend moved to `client/` directory
- [x] `vercel.json` configuration created
- [x] Package.json scripts updated
- [x] Environment variable templates created

### ✅ MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created with password saved
- [ ] Network access set to `0.0.0.0/0` (whitelist all IPs)
- [ ] Connection string copied
- [ ] Connection string tested locally

### ✅ Git Repository
- [ ] Code committed to Git
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible

### ✅ Vercel Account
- [ ] Vercel account created
- [ ] GitHub/GitLab connected to Vercel

---

## Deployment Steps

### ✅ Import Project to Vercel
- [ ] Visited [vercel.com/new](https://vercel.com/new)
- [ ] Selected Git repository
- [ ] Project imported successfully

### ✅ Configure Build Settings
- [ ] Framework Preset: `Other`
- [ ] Root Directory: `./` (root)
- [ ] Build Command: `cd client && npm install && npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### ✅ Add Environment Variables
- [ ] `MONGODB_URI` added (MongoDB Atlas connection string)
- [ ] `FRONTEND_URL` added (placeholder or actual domain)
- [ ] `NODE_ENV` set to `production`
- [ ] All variables set for: Production, Preview, Development

### ✅ Initial Deployment
- [ ] Clicked "Deploy" button
- [ ] Build completed successfully (2-3 minutes)
- [ ] Deployment URL received (e.g., `https://meduhub-abc123.vercel.app`)

---

## Post-Deployment

### ✅ Update Environment Variables
- [ ] Copied actual Vercel deployment URL
- [ ] Updated `FRONTEND_URL` in Vercel environment variables
- [ ] Redeployed application

### ✅ Testing - Health Check
- [ ] Visited: `https://your-project.vercel.app/api/health`
- [ ] Response received:
  ```json
  {
    "status": "ok",
    "message": "Meduhub API is running on Vercel",
    "timestamp": "...",
    "environment": "production"
  }
  ```

### ✅ Testing - Frontend
- [ ] Visited homepage: `https://your-project.vercel.app`
- [ ] Page loads successfully
- [ ] 3D animations working
- [ ] Navigation working
- [ ] No console errors

### ✅ Testing - Registration Form
- [ ] Opened registration modal
- [ ] Filled out form with valid data
- [ ] Submitted successfully
- [ ] Success message displayed
- [ ] No CORS errors in console

### ✅ Testing - Database
- [ ] Logged into MongoDB Atlas
- [ ] Navigated to Browse Collections
- [ ] Verified registration data saved in `Meduhub` collection
- [ ] Data fields correct (name, email, phone, etc.)

### ✅ Testing - API Endpoints
Test with cURL or Postman:

**Registration POST:**
```bash
curl -X POST https://your-project.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9876543210",
    "email": "test@example.com",
    "state": "Maharashtra",
    "city": "Mumbai"
  }'
```
- [ ] Returns success response

**Get Registrations (Admin):**
```bash
curl https://your-project.vercel.app/api/registrations
```
- [ ] Returns list of registrations

**Update Registration (Admin):**
```bash
curl -X PATCH https://your-project.vercel.app/api/registrations/REGISTRATION_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted", "notes": "Called customer"}'
```
- [ ] Returns updated registration

---

## Production Verification

### ✅ Performance
- [ ] Page loads in under 3 seconds
- [ ] API responds in under 1 second
- [ ] No 500 errors in logs
- [ ] Cold start acceptable (first request may be slower)

### ✅ Security
- [ ] CORS working correctly (no unauthorized origins)
- [ ] Environment variables hidden from client
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers present (check Network tab)

### ✅ Monitoring
- [ ] Vercel Analytics dashboard accessible
- [ ] Function logs visible in Vercel
- [ ] MongoDB metrics showing connections

### ✅ Mobile Responsiveness
- [ ] Tested on mobile device or Chrome DevTools
- [ ] Layout responsive
- [ ] Forms work on mobile
- [ ] 3D animations perform acceptably

---

## Optional Enhancements

### ✅ Custom Domain
- [ ] Domain purchased/available
- [ ] Domain added in Vercel project settings
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] `FRONTEND_URL` updated with custom domain

### ✅ Monitoring & Logging
- [ ] Sentry/LogRocket integration (optional)
- [ ] Vercel Analytics enabled
- [ ] MongoDB monitoring alerts set up

### ✅ CI/CD Pipeline
- [ ] Automatic deployments on Git push enabled
- [ ] Preview deployments for branches working
- [ ] Production deployments only from `main` branch

---

## Troubleshooting Checklist

If something doesn't work, verify:

### API Issues
- [ ] `api/index.js` file exists
- [ ] `vercel.json` routing configured correctly
- [ ] All environment variables added
- [ ] MongoDB connection string correct
- [ ] `0.0.0.0/0` whitelisted in MongoDB Atlas

### CORS Issues
- [ ] `FRONTEND_URL` environment variable correct
- [ ] Redeployed after updating `FRONTEND_URL`
- [ ] Browser cache cleared

### Build Failures
- [ ] Build command correct: `cd client && npm install && npm run build`
- [ ] Output directory correct: `dist`
- [ ] All dependencies in `package.json`
- [ ] No syntax errors in code

### Database Issues
- [ ] MongoDB Atlas cluster running
- [ ] Network access configured
- [ ] Database user has correct permissions
- [ ] Connection string includes password

---

## 🎉 Deployment Complete!

Once all items are checked, your Meduhub application is successfully deployed and production-ready!

### Next Steps:
1. Share your live URL with stakeholders
2. Monitor Vercel Analytics for traffic
3. Check MongoDB Atlas for data collection
4. Plan future feature enhancements

---

**Deployed URL:** `___________________________________`

**MongoDB Cluster:** `___________________________________`

**Deployment Date:** `___________________________________`

**Deployed By:** `___________________________________`

---

**Need help?** Refer to:
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Full deployment guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick deployment steps
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
