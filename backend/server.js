const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env from backend directory explicitly
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Music directory - from env or fallback to public/music
const MUSIC_DIR = process.env.MUSIC_DIR || path.join(__dirname, 'public', 'music');

// Middleware
app.use(cors());
app.use(express.json());

// Serve local MP3 files directly at /music/
app.use('/music', express.static(MUSIC_DIR));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const songsRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlist');
app.use('/api/songs', songsRoutes);
app.use('/api/playlist', playlistRoutes);

// Auto-scan music folder and return song list
app.get('/api/local-songs', (req, res) => {
  try {
    if (!fs.existsSync(MUSIC_DIR)) {
      return res.json([]);
    }
    const files = fs.readdirSync(MUSIC_DIR).filter(f => f.toLowerCase().endsWith('.mp3')).sort();
    const songs = files.map((file, index) => ({
      id: `local_${index + 1}`,
      name: file.replace(/\.mp3$/i, '').replace(/[-_]/g, ' '),
      artists: ['Local'],
      album: { images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' }] },
      audio_url: `/music/${encodeURIComponent(file)}`,
      language: 'tamil',
      vibe: 'energetic'
    }));
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to fetch songs from Google Drive
async function fetchDriveSongs() {
  const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
  const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!API_KEY || !FOLDER_ID) {
    throw new Error('Google Drive configuration is missing (GOOGLE_DRIVE_API_KEY or GOOGLE_DRIVE_FOLDER_ID)');
  }

  const { google } = require('googleapis');
  const drive = google.drive({ version: 'v3' });

  const res = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and mimeType='audio/mpeg' and trashed=false`,
    fields: 'files(id, name)',
    pageSize: 1000,
    key: API_KEY
  });

  const files = res.data.files || [];

  return files.map((file) => ({
    id: `drive_${file.id}`,
    name: file.name.replace(/\.mp3$/i, '').replace(/[-_]/g, ' '),
    artists: ['Google Drive'],
    album: {
      images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' }]
    },
    audio_url: `/api/stream-audio/${file.id}`,
    language: 'tamil',
    vibe: 'energetic'
  }));
}

// Unified Library songs route supporting both Local and Google Drive
app.get('/api/library-songs', async (req, res) => {
  try {
    const source = (process.env.MUSIC_SOURCE || 'local').toLowerCase();
    if (source === 'cloud' || source === 'drive' || source === 'google') {
      const songs = await fetchDriveSongs();
      res.json(songs);
    } else {
      if (!fs.existsSync(MUSIC_DIR)) {
        return res.json([]);
      }
      const files = fs.readdirSync(MUSIC_DIR).filter(f => f.toLowerCase().endsWith('.mp3')).sort();
      const songs = files.map((file, index) => ({
        id: `local_${index + 1}`,
        name: file.replace(/\.mp3$/i, '').replace(/[-_]/g, ' '),
        artists: ['Local'],
        album: { images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' }] },
        audio_url: `/music/${encodeURIComponent(file)}`,
        language: 'tamil',
        vibe: 'energetic'
      }));
      res.json(songs);
    }
  } catch (err) {
    console.error('Library fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Stream audio from Google Drive supporting seeking/range requests
app.get('/api/stream-audio/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;

    if (!API_KEY) {
      return res.status(500).send('Google Drive API Key is missing');
    }

    const { google } = require('googleapis');
    const drive = google.drive({ version: 'v3' });

    // Forward range headers from client browser to Google Drive
    const driveHeaders = {};
    if (req.headers.range) {
      driveHeaders.range = req.headers.range;
    }

    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
        key: API_KEY
      },
      {
        responseType: 'stream',
        headers: driveHeaders
      }
    );

    // Set status from Google Drive response
    res.status(response.status);

    // Always set accept-ranges so browsers can seek
    res.setHeader('accept-ranges', 'bytes');

    // Copy relevant headers from Google Drive response
    const headersToCopy = [
      'content-type',
      'content-length',
      'content-range',
      'cache-control'
    ];

    const getHeader = (headersObj, name) => {
      if (!headersObj) return null;
      if (typeof headersObj.get === 'function') {
        return headersObj.get(name);
      }
      return headersObj[name] || headersObj[name.toLowerCase()];
    };

    headersToCopy.forEach(header => {
      const val = getHeader(response.headers, header);
      if (val) {
        res.setHeader(header, val);
      }
    });

    response.data.pipe(res);
  } catch (err) {
    console.error('Stream error:', err.message);
    res.status(500).send('Error streaming audio from Google Drive');
  }
});


// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Express 5 requires {*splat} syntax for catch-all routes
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🎵 Serving music from: ${MUSIC_DIR}`);
});
