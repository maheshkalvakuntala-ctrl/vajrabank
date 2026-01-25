# 🚀 START BACKEND SERVER - CRITICAL

## ⚠️ The Backend Server Must Be Running!

All the `ERR_CONNECTION_REFUSED` errors you're seeing are because **the backend server is not running**.

## Quick Start (Choose One Method)

### Method 1: Using npm (Recommended)

1. **Open a NEW terminal window** (keep your frontend terminal running)
2. Navigate to server directory:
   ```bash
   cd server
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Method 2: Using Startup Script (Windows)

1. **Double-click** the file: `server/start-server.bat`
2. The server will start automatically

### Method 3: Using Startup Script (Mac/Linux)

1. Open terminal
2. Run:
   ```bash
   cd server
   chmod +x start-server.sh
   ./start-server.sh
   ```

## ✅ Verify Server is Running

After starting, you should see:
```
🚀========================================🚀
   VajraBank Ad System Backend
   Server running on port 5000
   Environment: development
   URL: http://localhost:5000
🚀========================================🚀
```

**Test it:** Open `http://localhost:5000/health` in your browser

## 🔄 After Server Starts

1. **Refresh your frontend** (the React app in your browser)
2. **Try the payment flow again**
3. All connection errors should disappear

## 📝 Important

- You need **TWO terminals running**:
  - Terminal 1: Frontend (`npm run dev` in root directory)
  - Terminal 2: Backend (`npm start` in server directory)

- The backend is required for:
  - ✅ Partner registration
  - ✅ Payment verification
  - ✅ Ad creation
  - ✅ Admin notifications
  - ✅ Dashboard data

## 🆘 Troubleshooting

### Port 5000 Already in Use
If you see "EADDRINUSE":
- Find what's using port 5000
- Kill that process or change PORT in `server/.env`

### Dependencies Not Installed
If you see module errors:
```bash
cd server
npm install
```

### Still Not Working?
1. Check `server/.env` exists (optional - works without it)
2. Make sure you're in the `server` directory
3. Check Node.js is installed: `node --version`
