# Professional Real-Time Chess Web Application

A complete, production-ready chess web application with multiplayer support, AI opponent, multiple game modes, and polished UI/UX.

## Features

### Game Modes
- **Local Game**: Play against a friend on the same device
- **vs Computer**: Challenge AI opponents with three difficulty levels (Easy, Medium, Hard)
- **Online Play**: Compete with players from around the world (Socket.io integration)

### Game Features
- **Real-time gameplay** with smooth animations
- **Multiple time controls**: Blitz (5 min), Rapid (10 min), Classical (30 min)
- **Sound effects** for moves, captures, check, checkmate, and draws
- **Move history** with algebraic notation
- **Captured pieces** display
- **Game statistics** and analysis
- **Responsive design** for mobile and desktop

### Technical Features
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **chess.js** for chess logic
- **react-chessboard** for board UI
- **Socket.io** for multiplayer
- **Web Audio API** for sound effects

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Lovable backend (for multiplayer features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chess-game
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Lovable backend URL
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment to Vercel

1. **Quick Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/chess-game)

2. **Manual Deploy**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on every push to main

3. **Environment Variables** (set in Vercel):
   - `VITE_LOVABLE_BACKEND_URL`: Your Lovable backend URL
   - `VITE_SOCKET_URL`: Your Socket.io server URL
   - `VITE_NODE_ENV`: `production`

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure

```
chess-game/
├── src/
│   ├── components/          # React components
│   │   ├── Board/          # Chess board components
│   │   ├── Game/           # Game UI components
│   │   ├── Modals/         # Modal dialogs
│   │   ├── Menu/           # Menu screens
│   │   └── UI/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/
│   └── sounds/             # Sound effect files
└── package.json
```

## Game Controls

### Basic Controls
- **Click** on a piece to select it, then click on a destination square to move
- **Drag and drop** pieces to move them
- **Right-click** on squares to mark them

### Game Actions
- **New Game**: Start a new game
- **Pause/Resume**: Pause or resume the current game
- **Resign**: Surrender the current game
- **Offer Draw**: Propose a draw to your opponent
- **Flip Board**: Rotate the board view
- **Settings**: Access game settings

## AI Difficulty Levels

- **Easy**: Random moves - suitable for beginners
- **Medium**: Basic strategy with 2-ply search - good for intermediate players  
- **Hard**: Advanced strategy with 3-ply search - challenging for experienced players

## Time Controls

- **Blitz**: 5 minutes per player (with optional 3-second increment)
- **Rapid**: 10 minutes per player (with optional 5-second increment)
- **Classical**: 30 minutes per player (with optional 10-second increment)

## Sound Effects

The game includes sound effects for:
- Piece movements
- Piece captures
- Check announcements
- Checkmate
- Draw situations

Sound can be toggled on/off in the game controls.

## Multiplayer

Online multiplayer is implemented using Socket.io:
- Create or join rooms with 6-character codes
- Real-time move synchronization
- Chat functionality (planned)
- Spectator mode (planned)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) for chess logic
- [react-chessboard](https://github.com/Clariity/react-chessboard) for board UI
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zustand](https://github.com/pmndrs/zustand) for state management