const express = require('express');
const cors = require('express'); // Wait, cors is its own package
const corsPkg = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsPkg());
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
