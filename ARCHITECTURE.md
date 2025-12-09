# 🏗️ Meduhub Architecture - Vercel Deployment

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                             │
│                     (User's Web Browser)                            │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS Request
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                          │
│                    (Global CDN + Routing)                           │
│                                                                     │
│  ┌────────────────────────┐         ┌──────────────────────────┐  │
│  │   Static Assets        │         │   API Routes             │  │
│  │   /index.html          │         │   /api/*                 │  │
│  │   /assets/*.js         │         │                          │  │
│  │   /assets/*.css        │         │   → Serverless Function  │  │
│  └────────────────────────┘         └──────────────────────────┘  │
└────────────────────────────┬────────────────────┬───────────────────┘
                             │                    │
                Frontend     │                    │ Backend API
                             │                    │
                             ▼                    ▼
                ┌─────────────────────┐  ┌────────────────────────┐
                │  VERCEL FRONTEND    │  │  VERCEL SERVERLESS     │
                │  (Static Site)      │  │  (api/index.js)        │
                │                     │  │                        │
                │  • React App        │  │  • Express.js          │
                │  • Vite Build       │  │  • REST API Routes     │
                │  • Three.js         │  │  • Mongoose ODM        │
                │  • Framer Motion    │  │  • Connection Cache    │
                └─────────────────────┘  └──────────┬─────────────┘
                                                    │
                                                    │ MongoDB Protocol
                                                    │ (Cached Connection)
                                                    ▼
                                         ┌────────────────────────┐
                                         │   MONGODB ATLAS        │
                                         │   (Cloud Database)     │
                                         │                        │
                                         │  • Meduhub Collection  │
                                         │  • Registration Docs   │
                                         │  • Auto Indexing       │
                                         └────────────────────────┘
```

---

## Data Flow Diagram

### User Registration Flow

```
┌──────────┐
│  User    │
│ Browser  │
└────┬─────┘
     │
     │ 1. User fills registration form
     │    { name, email, phone, state, city }
     │
     ▼
┌────────────────────┐
│   React Frontend   │
│   (Client-Side)    │
└────┬───────────────┘
     │
     │ 2. POST /api/register
     │    (JSON payload)
     │
     ▼
┌────────────────────────────┐
│   Vercel Edge Network      │
│   (Route to API function)  │
└────┬───────────────────────┘
     │
     │ 3. Invoke serverless function
     │
     ▼
┌─────────────────────────────────┐
│   api/index.js                  │
│   (Express Serverless Function) │
│                                 │
│   4. Connect to MongoDB         │
│      (Use cached connection)    │
│                                 │
│   5. Validate input             │
│      • Check required fields    │
│      • Validate phone format    │
│      • Validate email format    │
│                                 │
│   6. Check duplicates           │
│      • Query last 24 hours      │
│      • Match phone or email     │
│                                 │
│   7. Save to database           │
│      • Create Registration doc  │
│      • Set default status       │
└────┬────────────────────────────┘
     │
     │ 8. MongoDB save operation
     │
     ▼
┌──────────────────────┐
│   MongoDB Atlas      │
│   (Cloud Database)   │
│                      │
│   Meduhub Collection │
│   {                  │
│     name: "...",     │
│     email: "...",    │
│     phone: "...",    │
│     state: "...",    │
│     city: "...",     │
│     status: "new",   │
│     createdAt: ...   │
│   }                  │
└────┬─────────────────┘
     │
     │ 9. Return success/error
     │
     ▼
┌────────────────────────┐
│   api/index.js         │
│   Send JSON Response   │
└────┬───────────────────┘
     │
     │ 10. HTTP 201 Created
     │     { success: true, ... }
     │
     ▼
┌────────────────────┐
│   React Frontend   │
│   Display Success  │
└────┬───────────────┘
     │
     │ 11. Show success message
     │     "Registration successful!"
     │
     ▼
┌──────────┐
│   User   │
│  Browser │
└──────────┘
```

---

## Technology Stack Details

### Frontend Layer (Client)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 19 | Component-based UI |
| **Build Tool** | Vite 7 | Fast dev server & optimized builds |
| **3D Graphics** | Three.js + R3F | Interactive 3D background |
| **Animations** | Framer Motion + GSAP | Smooth UI animations |
| **HTTP Client** | Axios | API requests |
| **Styling** | Vanilla CSS | Custom styling with variables |

**Build Output:**
- Minified JS bundles (code splitting)
- Optimized CSS
- Static HTML
- Compressed assets

---

### Backend Layer (Serverless)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 20.x | Serverless function runtime |
| **Framework** | Express.js | REST API routing |
| **Database ODM** | Mongoose | MongoDB object modeling |
| **Validation** | Mongoose Schemas | Input validation |
| **CORS** | CORS Middleware | Cross-origin requests |
| **Connection Pool** | Custom Cache | Reuse MongoDB connections |

**Function Configuration:**
- Memory: 1024 MB
- Timeout: 10 seconds (Hobby)
- Region: Mumbai (bom1)
- Cold start: ~500ms
- Warm execution: ~50-200ms

---

### Database Layer (MongoDB Atlas)

| Component | Configuration | Details |
|-----------|--------------|---------|
| **Cluster** | M0 Sandbox (Free) | 512 MB storage |
| **Region** | Mumbai (ap-south-1) | Low latency for India |
| **Collections** | Meduhub | Registration documents |
| **Indexes** | createdAt, email, phone | Fast queries |
| **Network** | Whitelisted: 0.0.0.0/0 | Allow Vercel IPs |
| **Connection** | TLS/SSL Encrypted | Secure connections |

**Schema Structure:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, indexed),
  phone: String (required, indexed),
  state: String (required),
  city: String (required),
  inquiryType: String (enum),
  status: String (enum),
  notes: String,
  createdAt: Date (indexed, default: now)
}
```

---

## Routing Configuration

### Frontend Routes (SPA)
```
/                  → index.html (React app)
/assets/*         → Static JS/CSS bundles
/public/*         → Static assets (images, etc.)
```

### API Routes (Serverless)
```
/api/health                    → GET    Health check
/api/register                  → POST   Submit registration
/api/registrations             → GET    List all registrations
/api/registrations/:id         → PATCH  Update registration status
```

**Vercel Routing Logic:**
1. Try to match static file
2. If path starts with `/api/*` → Invoke serverless function
3. Otherwise → Serve `index.html` (SPA fallback)

---

## Security Architecture

### 1. **Transport Security**
- ✅ HTTPS enforced (TLS 1.3)
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ Automatic SSL certificates (Vercel managed)

### 2. **CORS Policy**
```javascript
Allowed Origins:
  - Production: https://your-project.vercel.app
  - Preview: https://your-project-*.vercel.app
  - Development: http://localhost:5173

Allowed Methods: GET, POST, PATCH, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
Credentials: true
```

### 3. **Headers**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### 4. **Input Validation**
- Email regex validation
- Phone number format (Indian: 10 digits starting with 6-9)
- Required field checks
- Mongoose schema validation

### 5. **Database Security**
- Connection string in environment variables
- TLS/SSL encrypted connections
- IP whitelist (Atlas Network Access)
- Database user authentication

---

## Performance Optimizations

### 1. **Frontend**
- ✅ Code splitting (React, Three.js, Animation separate chunks)
- ✅ Tree shaking (remove unused code)
- ✅ Minification (JS + CSS)
- ✅ Gzip compression (automatic on Vercel)
- ✅ CDN distribution (Vercel Edge Network)
- ✅ Image optimization (future: use Vercel Image)

### 2. **Backend**
- ✅ **Connection Caching**: Reuse MongoDB connections across invocations
- ✅ **Warm Functions**: Vercel keeps frequently-used functions warm
- ✅ **Region Selection**: Deployed to Mumbai (bom1) for low latency
- ✅ **Indexed Queries**: Database indexes on frequently queried fields

### 3. **Database**
- ✅ Indexes on `createdAt`, `email`, `phone`
- ✅ Efficient queries (avoid full collection scans)
- ✅ Connection pooling via Mongoose

---

## Scaling Strategy

### Current Setup (Hobby/Free Tier)
- **Concurrent Executions**: 10 (Vercel Hobby limit)
- **Request Duration**: 10s max
- **Bandwidth**: Unlimited
- **Database**: 512 MB storage (MongoDB M0)

### Scaling Options

**If traffic increases:**

1. **Upgrade Vercel Plan** (Pro)
   - 100 concurrent executions
   - 60s function timeout
   - Advanced analytics
   - $20/month

2. **Upgrade MongoDB** (M10)
   - 10 GB storage
   - Dedicated cluster
   - Auto-scaling
   - $57/month

3. **Add Caching Layer**
   - Vercel KV (Redis)
   - Cache frequent queries
   - Reduce database load

4. **Add Rate Limiting**
   - Prevent spam submissions
   - Use Vercel Edge Config
   - Or add express-rate-limit

---

## Monitoring & Observability

### 1. **Vercel Dashboard**
- Real-time function logs
- Request/response times
- Error rates
- Bandwidth usage
- Build status

### 2. **MongoDB Atlas**
- Connection metrics
- Query performance
- Storage usage
- Index usage stats

### 3. **Custom Logging**
```javascript
// Already implemented in api/index.js
console.log('📝 New registration from ${name}');
console.error('Registration error:', error);
```

View logs:
```bash
vercel logs your-project.vercel.app --follow
```

---

## Disaster Recovery

### Backup Strategy

**MongoDB Atlas Backups (M10+ clusters):**
- Automatic daily backups
- Point-in-time recovery
- 7-day retention

**Free Tier (M0):**
- ⚠️ No automatic backups
- Manual export via `mongodump`:
```bash
mongodump --uri="your-connection-string" --out=./backup
```

### Rollback Procedure

**Code Rollback:**
1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click **"⋯"** → **"Promote to Production"**
4. Instant rollback (no rebuild)

**Database Rollback:**
1. Restore from backup
2. Or manually fix data in Atlas

---

## Cost Estimate (Free Tier)

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| **Vercel** | Hobby | $0/month | 100 GB bandwidth, 10 concurrent executions |
| **MongoDB Atlas** | M0 Sandbox | $0/month | 512 MB storage, shared cluster |
| **Total** | | **$0/month** | Suitable for 1000-5000 users/month |

**When to upgrade:**
- >100 GB bandwidth/month → Vercel Pro ($20)
- >512 MB database → MongoDB M10 ($57)
- >10 concurrent requests → Vercel Pro

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/meduhub` |
| `FRONTEND_URL` | CORS origin | `https://meduhub.vercel.app` |
| `NODE_ENV` | Runtime environment | `production` |

---

## Deployment Pipeline

```
┌─────────────┐
│   Git Push  │
│   to GitHub │
└──────┬──────┘
       │
       │ Webhook triggers Vercel
       │
       ▼
┌────────────────────┐
│  Vercel Build      │
│                    │
│  1. Install deps   │
│  2. Build client   │
│  3. Bundle API     │
└──────┬─────────────┘
       │
       │ Build successful
       │
       ▼
┌────────────────────┐
│  Deploy to Edge    │
│                    │
│  1. Upload assets  │
│  2. Deploy funcs   │
│  3. Update DNS     │
└──────┬─────────────┘
       │
       │ Health checks pass
       │
       ▼
┌────────────────────┐
│  Live Production   │
│                    │
│  ✅ New version    │
│     deployed       │
└────────────────────┘
```

**Deployment Time:** 2-3 minutes average

---

## Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **React Docs**: https://react.dev
- **Vite Guide**: https://vitejs.dev

---

**Architecture Version:** 1.0  
**Last Updated:** December 9, 2025  
**Maintained By:** Development Team
