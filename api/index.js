import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// ============================================================================
// VERCEL SERVERLESS CONFIGURATION
// ============================================================================
// Connection caching for MongoDB to avoid reconnecting on every request
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    console.log('✅ Using cached MongoDB connection');
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('❌ MONGODB_URI environment variable is not defined');
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = connection;
    console.log('✅ New MongoDB connection established');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// ============================================================================
// CORS CONFIGURATION
// ============================================================================
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// MONGODB SCHEMA
// ============================================================================
const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  inquiryType: {
    type: String,
    enum: ['register', 'inquiry'],
    default: 'register'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'enrolled', 'closed'],
    default: 'new'
  },
  notes: {
    type: String,
    default: ''
  }
});

// Indexes for performance
registrationSchema.index({ createdAt: -1 });
registrationSchema.index({ email: 1 });
registrationSchema.index({ phone: 1 });

// Use existing model if available (prevents OverwriteModelError)
const Registration = mongoose.models.Registration || 
  mongoose.model('Registration', registrationSchema, 'Meduhub');

// ============================================================================
// API ROUTES
// ============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Meduhub API is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Submit registration
app.post('/api/register', async (req, res) => {
  try {
    await connectToDatabase();

    const { name, phone, email, state, city, inquiryType } = req.body;

    // Validation
    if (!name || !phone || !email || !state || !city) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check for duplicate registration (same phone or email in last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingRegistration = await Registration.findOne({
      $or: [{ phone }, { email }],
      createdAt: { $gte: twentyFourHoursAgo }
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted a registration recently. Our team will contact you soon!'
      });
    }

    // Create new registration
    const registration = new Registration({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      state,
      city,
      inquiryType: inquiryType || 'register'
    });

    await registration.save();

    console.log(`📝 New ${inquiryType || 'registration'} from ${name} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      data: {
        id: registration._id,
        name: registration.name,
        email: registration.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Get all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
  try {
    await connectToDatabase();

    const { page = 1, limit = 20, status, inquiryType } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (inquiryType) query.inquiryType = inquiryType;

    const registrations = await Registration.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Registration.countDocuments(query);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

// Update registration status (Admin)
app.patch('/api/registrations/:id', async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.params;
    const { status, notes } = req.body;

    const registration = await Registration.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration'
    });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// ============================================================================
// EXPORT FOR VERCEL SERVERLESS
// ============================================================================
export default app;
