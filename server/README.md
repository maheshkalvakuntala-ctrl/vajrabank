# Node.js Advertisement Publishing System Backend

## 📋 Overview
Complete Express + MongoDB backend for managing advertisements with role-based access control, automatic expiry, and page-level visibility.

## 🛠️ Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing

## 📁 Project Structure
```
server/
├── config/
│   └── database.js         # MongoDB connection
├── models/
│   └── Ad.js              # Advertisement schema
├── controllers/
│   └── adController.js    # Business logic
├── routes/
│   └── adRoutes.js        # API endpoints
├── middleware/
│   └── auth.js            # JWT auth & role checking
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── server.js              # Entry point
```

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vajrabank_ads
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB
Ensure MongoDB is running locally or use MongoDB Atlas.

### 4. Run Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server will start at: `http://localhost:5000`

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Sample JWT Payload
```json
{
  "id": "user123",
  "email": "partner@example.com",
  "role": "partner"
}
```

## 📡 API Endpoints

### Public Routes

#### Get Active Ads
```http
GET /api/ads/active
```

**Query Parameters:**
- `page` (optional): Filter by page - `home`, `about`, `contact`, `user`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "65abc123...",
      "title": "Summer Sale",
      "imageUrl": "https://example.com/ad.jpg",
      "redirectUrl": "https://example.com/sale",
      "daysRemaining": 15,
      "showOn": {
        "home": true,
        "about": false,
        "contact": false,
        "user": true
      }
    }
  ]
}
```

### Partner Routes (Requires `partner` role)

#### Create Advertisement
```http
POST /api/ads/create
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Summer Sale - 50% Off",
  "imageUrl": "https://example.com/images/sale.jpg",
  "redirectUrl": "https://example.com/sale",
  "durationDays": 30,
  "showOn": {
    "home": true,
    "about": false,
    "contact": true,
    "user": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Advertisement created successfully. Awaiting admin approval.",
  "data": {
    "_id": "65abc123...",
    "title": "Summer Sale - 50% Off",
    "status": "pending",
    "durationDays": 30,
    "createdAt": "2026-01-19T17:38:14.000Z"
  }
}
```

### Admin Routes (Requires `admin` role)

#### Approve Advertisement
```http
PUT /api/ads/approve/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Advertisement approved successfully. Will be active until 2/18/2026",
  "data": {
    "id": "65abc123...",
    "title": "Summer Sale - 50% Off",
    "status": "approved",
    "startDate": "2026-01-19T17:38:14.000Z",
    "endDate": "2026-02-18T17:38:14.000Z",
    "durationDays": 30,
    "daysRemaining": 30
  }
}
```

#### Reject Advertisement
```http
PUT /api/ads/reject/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Image quality is too low"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Advertisement rejected successfully",
  "data": {
    "id": "65abc123...",
    "title": "Summer Sale - 50% Off",
    "status": "rejected",
    "rejectedAt": "2026-01-19T17:38:14.000Z",
    "rejectionReason": "Image quality is too low"
  }
}
```

#### Get All Ads (Admin Panel)
```http
GET /api/ads/all
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): `pending`, `approved`, `rejected`, `expired`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 25,
  "page": 1,
  "totalPages": 2,
  "data": [ /* array of ads */ ]
}
```

#### Disable Advertisement
```http
DELETE /api/ads/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Advertisement disabled successfully",
  "data": {
    "id": "65abc123...",
    "title": "Summer Sale",
    "status": "expired"
  }
}
```

#### Get Statistics
```http
GET /api/ads/stats
Authorization: Bearer <token>
```

## 🔄 Auto-Expiry Logic

The system automatically handles ad expiration:

1. **On Creation**: Ad status = `pending`, no dates set
2. **On Approval**: 
   - `startDate` = current server time
   - `endDate` = startDate + durationDays
   - `status` = `approved`
3. **On Every Request** to `/api/ads/active`:
   - System checks all approved ads
   - If `endDate < currentDate`, marks as `expired`
   - Returns only valid active ads

**This ensures ads NEVER disappear due to page refresh - they're stored in MongoDB!**

## 📊 Ad Lifecycle

```
[Partner Creates] → pending
       ↓
[Admin Approves] → approved (startDate & endDate set)
       ↓
[Auto Check] → expired (when endDate passes)
```

Alternative path:
```
[Partner Creates] → pending
       ↓
[Admin Rejects] → rejected (final state)
```

## 🧪 Testing

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Create Test Ad (Partner)
```bash
curl -X POST http://localhost:5000/api/ads/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PARTNER_TOKEN" \
  -d '{
    "title": "Test Ad",
    "imageUrl": "https://via.placeholder.com/800x200",
    "redirectUrl": "https://example.com",
    "durationDays": 7,
    "showOn": {"home": true, "about": true, "contact": false, "user": false}
  }'
```

### 3. Get Active Ads (Public)
```bash
curl http://localhost:5000/api/ads/active?page=home
```

## 🔑 Key Features

✅ **Persistent Storage**: Ads stored in MongoDB, never disappear on refresh  
✅ **Auto-Expiry**: Automatic status updates based on endDate  
✅ **Role-Based Access**: Partner creates, Admin approves  
✅ **Page-Level Visibility**: Show ads on specific pages  
✅ **Duration Control**: Flexible 1-365 day duration  
✅ **Audit Trail**: Tracks who created, approved, rejected

## 🚨 Important Notes

1. **JWT Token**: You need to implement a separate auth system to generate tokens
2. **MongoDB**: Must be running before starting server
3. **Environment**: Always set proper environment variables
4. **CORS**: Configure CLIENT_URL to match your frontend

## 📝 Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start MongoDB
4. Run server: `npm run dev`
5. Test with sample requests above
6. Integrate with your React frontend

---

**Created by Senior Backend Engineer** 🚀
