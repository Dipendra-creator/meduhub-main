# Meduhub Landing Page

A stunning 3D interactive landing page for Meduhub - a medical education platform offering NEET and NExT preparation courses.

## 🚀 **DEPLOYED ON VERCEL - PRODUCTION READY**

This project is fully configured for **Vercel serverless deployment** with Express backend running as serverless functions.

### Quick Links
- 📖 **[Deployment Guide](./VERCEL_DEPLOYMENT.md)** - Complete step-by-step deployment instructions
- ⚡ **[Quick Start](./QUICKSTART.md)** - Deploy in 3 steps
- 🔧 **[Environment Setup](./.env.vercel)** - Required environment variables

---

## Features

- ✨ **3D Interactive Background** - Built with Three.js, React Three Fiber, and Drei
  - Animated DNA helixes
  - Floating molecular structures
  - Interactive particles
  - Mouse-following light effects
  
- 🎨 **Modern UI/UX**
  - Glassmorphism effects
  - Smooth scroll animations
  - Responsive design (Mobile-first)
  - Gradient text and buttons
  
- 📝 **Registration Form**
  - Form validation
  - State/City dropdowns for India
  - MongoDB backend storage
  - Success/Error handling

- 🔐 **Production Ready**
  - Serverless backend (Vercel-optimized)
  - MongoDB connection caching
  - CORS configured for production
  - Security headers enabled
  - Code splitting and optimization

## Tech Stack

### Frontend
- **React** (Vite)
- **Three.js** + **React Three Fiber** + **Drei**
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **Vanilla CSS** - Styling with CSS Variables

### Backend
- **Express.js** - REST API (Serverless on Vercel)
- **MongoDB Atlas** - Cloud Database
- **Mongoose** - ODM
- **CORS** - Cross-origin support

### Infrastructure
- **Vercel** - Hosting & Serverless Functions
- **MongoDB Atlas** - Database (M0 Free Tier compatible)
- **Git** - Version control

## Project Structure

```
landing-page/
├── api/
│   └── index.js              ← Backend serverless function
├── client/
│   ├── src/                  ← React frontend
│   │   ├── components/       ← React components
│   │   ├── data/            ← India locations data
│   │   └── styles/          ← CSS files
│   ├── public/              ← Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env.vercel              ← Vercel environment variables guide
├── .env.example             ← Local development template
├── package.json             ← Root dependencies
├── vercel.json              ← Vercel deployment config
├── VERCEL_DEPLOYMENT.md     ← Full deployment guide
└── QUICKSTART.md            ← Quick deployment steps
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (for production)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/meduhub-landing-page.git
cd meduhub-landing-page
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Configure environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB Atlas connection string
# MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/meduhub
```

### Running Locally

**Option 1: Run both frontend + backend**
```bash
npm run dev:all
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

**Option 2: Run separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (original server.js)
npm run backend:dev
```

### Deploy to Vercel

See **[QUICKSTART.md](./QUICKSTART.md)** for 3-step deployment guide or **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete instructions.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/register` | Submit registration |
| GET | `/api/registrations` | Get all registrations (admin) |
| PATCH | `/api/registrations/:id` | Update registration status |

### Registration Request Body
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "state": "Maharashtra",
  "city": "Mumbai",
  "inquiryType": "register"
}
```

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| < 480px | Small phones |
| 480-768px | Large phones |
| 768-1024px | Tablets |
| > 1024px | Desktop |

## Performance Optimizations

- Lazy loading of 3D scene
- Optimized particle count for mobile
- CSS containment for animations
- Proper cleanup of Three.js resources

## License

MIT License - Feel free to use this for your own projects!

## Credits

- Content from [meduhub.org](https://www.meduhub.org)
- Icons: Emoji-based for lightweight performance
- 3D: React Three Fiber ecosystem

---

Made with ❤️ for Medical Aspirants
