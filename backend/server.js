const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const NodeID3 = require('node-id3');

// Load .env from backend directory explicitly
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory cache for extracted local cover arts
const coverCache = {};

// Music directory - from env or fallback to public/music
const MUSIC_DIR = process.env.MUSIC_DIR || path.join(__dirname, 'public', 'music');

// ─── Smart Language Detection from filename ──────────────────────────────────
const LANGUAGE_KEYWORDS = {
  tamil:     ['tamil', 'tamizh', 'kollywood', 'anirudh', 'arrahman', 'ar rahman', 'sid sriram', 'yuvan', 'harris jayaraj', 'dhanush'],
  hindi:     ['hindi', 'bollywood', 'arijit', 'shreya', 'atif', 'kumar sanu', 'udit narayan', 'lata'],
  telugu:    ['telugu', 'tollywood', 'dsp', 'thaman', 'mm keeravani', 'ss rajamouli'],
  malayalam: ['malayalam', 'mollywood', 'ouseppachan', 'vidyasagar'],
  kannada:   ['kannada', 'sandalwood', 'arjun janya'],
  punjabi:   ['punjabi', 'diljit', 'ap dhillon', 'sidhu', 'gurnam bhullar'],
  english:   ['english', 'pop', 'edm', 'the weeknd', 'drake', 'taylor', 'adele', 'eminem'],
  bengali:   ['bengali', 'bangla'],
  marathi:   ['marathi'],
};

const VIBE_KEYWORDS = {
  romantic:  ['love', 'romantic', 'pyaar', 'kadhal', 'prema', 'kaadhal', 'heart', 'ishq'],
  sad:       ['sad', 'pain', 'dard', 'kadavul', 'breakup', 'cry', 'alone', 'kurai', 'thanimai'],
  energetic: ['dance', 'party', 'beat', 'kuthu', 'bang', 'club', 'fire', 'dhol', 'mass'],
  devotional:['god', 'bhajan', 'kovil', 'temple', 'prayer', 'devotional', 'bhagwan', 'swamy'],
  chill:     ['chill', 'lofi', 'rain', 'calm', 'soft', 'slow', 'sleep', 'relax'],
  folk:      ['folk', 'naatu', 'village', 'gaana', 'traditional', 'local'],
};

function detectLanguageFromFilename(filename) {
  const lower = filename.toLowerCase();
  for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return lang;
  }
  // Default to tamil since most local uploads are likely Tamil
  return 'tamil';
}

function detectVibeFromFilename(filename) {
  const lower = filename.toLowerCase();
  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return vibe;
  }
  return 'energetic';
}

function detectLanguageFromID3(tags, filename) {
  // Try ID3 language tag first (TLAN)
  if (tags && tags.language) {
    const lang = tags.language.toLowerCase();
    if (lang.includes('tam')) return 'tamil';
    if (lang.includes('hin')) return 'hindi';
    if (lang.includes('tel')) return 'telugu';
    if (lang.includes('mal')) return 'malayalam';
    if (lang.includes('kan')) return 'kannada';
    if (lang.includes('pun')) return 'punjabi';
    if (lang.includes('eng')) return 'english';
  }
  // Try genre/comment tags for language hints
  const searchStr = [
    tags?.title || '',
    tags?.artist || '',
    tags?.album || '',
    tags?.genre || '',
    filename
  ].join(' ').toLowerCase();

  for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    if (keywords.some(k => searchStr.includes(k))) return lang;
  }
  return detectLanguageFromFilename(filename);
}

function detectVibeFromID3(tags, filename) {
  const searchStr = [
    tags?.title || '',
    tags?.genre || '',
    filename
  ].join(' ').toLowerCase();

  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS)) {
    if (keywords.some(k => searchStr.includes(k))) return vibe;
  }
  return detectVibeFromFilename(filename);
}
// ────────────────────────────────────────────────────────────────────────────

// Middleware
app.use(cors());
app.use(express.json());

// Serve local MP3 files directly at /music/
app.use('/music', express.static(MUSIC_DIR));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️  Cover art route MUST be registered BEFORE the /api/songs router
//    to avoid being swallowed by the router's catch-all.
app.get('/api/songs/cover/:filename', (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const filePath = path.join(MUSIC_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.redirect('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80');
    }

    // Check in-memory cache
    if (coverCache[filename]) {
      const cached = coverCache[filename];
      if (cached.noCover) {
        return res.redirect('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80');
      }
      res.setHeader('Content-Type', cached.mime);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(cached.data);
    }

    // Read ID3 tags
    const tags = NodeID3.read(filePath);

    if (tags && tags.image && tags.image.imageBuffer) {
      const mime = tags.image.mime || 'image/jpeg';
      const data = tags.image.imageBuffer;

      // Cache it
      coverCache[filename] = { mime, data };

      res.setHeader('Content-Type', mime);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(data);
    } else {
      // Cache the "no cover" result to avoid parsing again
      coverCache[filename] = { noCover: true };
      return res.redirect('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80');
    }
  } catch (err) {
    console.error('Error extracting cover:', err.message);
    res.redirect('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80');
  }
});

// Routes (registered AFTER cover art route)
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
    const songs = files.map((file, index) => {
      // Read ID3 tags for smart metadata
      let tags = {};
      try { tags = NodeID3.read(path.join(MUSIC_DIR, file)) || {}; } catch (_) {}
      const title = (tags.title || file.replace(/\.mp3$/i, '')).replace(/[-_]/g, ' ');
      const artist = tags.artist || tags.performerInfo || 'Unknown Artist';
      const language = detectLanguageFromID3(tags, file);
      const vibe = detectVibeFromID3(tags, file);
      return {
        id: `local_${index + 1}`,
        name: title,
        artists: [artist],
        album: { images: [{ url: `/api/songs/cover/${encodeURIComponent(file)}` }] },
        audio_url: `/music/${encodeURIComponent(file)}`,
        language,
        vibe
      };
    });
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
    fields: 'files(id, name, thumbnailLink)',
    pageSize: 1000,
    key: API_KEY
  });

  const files = res.data.files || [];

  return files.map((file) => ({
    id: `drive_${file.id}`,
    name: file.name.replace(/\.mp3$/i, '').replace(/[-_]/g, ' '),
    artists: ['Google Drive'],
    album: {
      images: [{ url: file.thumbnailLink || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80' }]
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
      const songs = files.map((file, index) => {
        // Read ID3 tags for smart metadata
        let tags = {};
        try { tags = NodeID3.read(path.join(MUSIC_DIR, file)) || {}; } catch (_) {}
        const title = (tags.title || file.replace(/\.mp3$/i, '')).replace(/[-_]/g, ' ');
        const artist = tags.artist || tags.performerInfo || 'Unknown Artist';
        const language = detectLanguageFromID3(tags, file);
        const vibe = detectVibeFromID3(tags, file);
        return {
          id: `local_${index + 1}`,
          name: title,
          artists: [artist],
          album: { images: [{ url: `/api/songs/cover/${encodeURIComponent(file)}` }] },
          audio_url: `/music/${encodeURIComponent(file)}`,
          language,
          vibe
        };
      });
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
