# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

## Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment
```bash
# Create .env file from template
cp .env.example .env

# Edit .env and update these values:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (random secret key)
# - CLIENT_URL (your frontend URL)
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, just update MONGODB_URI in .env
```

### 4. Run Quick Start (Optional - for testing)
```bash
node quickstart.js
```
This will:
- Generate test JWT tokens
- Create sample ads
- Test auto-expiry logic

### 5. Start Server
```bash
npm run dev
```

## Testing

### Get Test Tokens
Run `node quickstart.js` to get JWT tokens for:
- Admin
- Partner  
- User

### Test API Endpoints

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Get Active Ads (Public):**
```bash
curl http://localhost:5000/api/ads/active?page=home
```

**Create Ad (Partner):**
```bash
curl -X POST http://localhost:5000/api/ads/create \
  -H "Authorization: Bearer <PARTNER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ad",
    "imageUrl": "https://via.placeholder.com/800x200",
    "redirectUrl": "https://example.com",
    "durationDays": 7,
    "showOn": {"home": true, "about": false, "contact": false, "user": false}
  }'
```

**Approve Ad (Admin):**
```bash
curl -X PUT http://localhost:5000/api/ads/approve/<AD_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

## File Structure
```
server/
├── config/           # Database configuration
├── controllers/      # Business logic
├── middleware/       # Auth & utilities
├── models/          # Mongoose schemas
├── routes/          # API endpoints
├── utils/           # Helper functions
├── server.js        # Entry point
└── quickstart.js    # Testing utility
```

## Key Features
✅ MongoDB persistence
✅ Auto-expiry logic
✅ JWT authentication
✅ Role-based access (admin/partner/user)
✅ Page-level visibility
✅ RESTful API

## Documentation
See [README.md](./README.md) for complete API documentation.
