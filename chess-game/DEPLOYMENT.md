# Deployment Guide for Chess Game

This guide will help you deploy the chess game frontend to Vercel and connect it with your Lovable backend.

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account (free tier available)
- Your Lovable backend URL
- Git repository with the code

### Step 1: Prepare Environment Variables

1. Copy the environment example file:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your actual values:
```env
VITE_LOVABLE_BACKEND_URL=https://your-lovable-backend-url.lovable.app
VITE_SOCKET_URL=https://your-lovable-backend-url.lovable.app
VITE_NODE_ENV=production
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd chess-game
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? chess-game (or your preferred name)
# - Directory? ./
# - Override settings? No
```

#### Option B: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `chess-game`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables in the dashboard
6. Click "Deploy"

### Step 3: Configure Environment Variables in Vercel

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `VITE_LOVABLE_BACKEND_URL`: Your Lovable backend URL
   - `VITE_SOCKET_URL`: Your Socket.io server URL (usually same as backend)
   - `VITE_NODE_ENV`: `production`

### Step 4: Update Lovable Backend CORS Settings

In your Lovable backend, ensure CORS is configured to allow your Vercel domain:

```javascript
// In your Lovable backend
app.use(cors({
  origin: [
    'https://your-chess-app.vercel.app',
    'http://localhost:5173', // For development
  ],
  credentials: true
}));
```

## 🔧 Backend Integration

### Socket.io Events

The frontend expects these Socket.io events from your Lovable backend:

#### Client to Server Events:
- `create_room` - Create a new game room
- `join_room` - Join an existing room
- `leave_room` - Leave current room
- `make_move` - Send a chess move
- `offer_draw` - Offer a draw
- `resign` - Resign the game
- `rematch` - Request a rematch

#### Server to Client Events:
- `room_created` - Room successfully created
- `room_joined` - Successfully joined room
- `player_joined` - Another player joined
- `player_left` - Player left the room
- `move_made` - Move received from opponent
- `game_ended` - Game finished
- `draw_offered` - Draw offer received
- `draw_declined` - Draw offer declined
- `error` - Error occurred

### Example Backend Implementation

```javascript
// Example Socket.io server setup in Lovable
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', (roomCode) => {
    // Create room logic
    socket.join(roomCode);
    socket.emit('room_created', { id: roomCode, code: roomCode });
  });

  socket.on('join_room', (roomCode) => {
    // Join room logic
    socket.join(roomCode);
    socket.emit('room_joined', { id: roomCode, code: roomCode });
  });

  socket.on('make_move', (moveData) => {
    // Broadcast move to other players in room
    socket.to(moveData.roomId).emit('move_made', moveData);
  });

  // Add other event handlers...
});
```

## 🧪 Testing the Deployment

1. **Test Local Build**:
```bash
npm run build
npm run preview
```

2. **Test Production URL**:
   - Visit your Vercel deployment URL
   - Test all game modes (Local, Computer, Online)
   - Verify sound effects work
   - Check responsive design on mobile

3. **Test Backend Integration**:
   - Create a room in online mode
   - Share room code with another player
   - Test real-time moves

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure your Lovable backend allows your Vercel domain
   - Check CORS configuration

2. **Socket Connection Failed**:
   - Verify `VITE_SOCKET_URL` is correct
   - Check if Socket.io is enabled in Lovable
   - Test backend URL accessibility

3. **Build Failures**:
   - Check Node.js version (Vercel uses 18.x by default)
   - Verify all dependencies are in `package.json`
   - Check for TypeScript errors

4. **Environment Variables**:
   - Ensure all `VITE_` prefixed variables are set
   - Redeploy after adding new environment variables

### Debug Commands:

```bash
# Check build locally
npm run build

# Test production build
npm run preview

# Check environment variables
echo $VITE_LOVABLE_BACKEND_URL
```

## 📱 Mobile Optimization

The app is already optimized for mobile, but you can further enhance:

1. **PWA Features** (optional):
   - Add `manifest.json`
   - Implement service worker
   - Enable offline play

2. **Touch Optimization**:
   - Drag and drop works on mobile
   - Responsive board sizing
   - Touch-friendly controls

## 🚀 Performance Optimization

1. **Vercel Optimizations**:
   - Automatic CDN distribution
   - Edge functions for API calls
   - Image optimization

2. **Frontend Optimizations**:
   - Code splitting (already implemented)
   - Lazy loading for components
   - Memoization for expensive calculations

## 📊 Monitoring

Consider adding:
- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring
- User analytics

Your chess game should now be successfully deployed and connected to your Lovable backend! 🎉