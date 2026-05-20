const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const songsRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlist');
app.use('/api/songs', songsRoutes);
app.use('/api/playlist', playlistRoutes);

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Express 5 requires {*splat} syntax for catch-all routes
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
