const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const getSongs = () => {
  const songsPath = path.join(__dirname, '../data/songs.json');
  if (fs.existsSync(songsPath)) {
    return JSON.parse(fs.readFileSync(songsPath, 'utf8'));
  }
  return [];
};

const B2_BUCKET_URL = process.env.B2_BUCKET_URL;

const mapSongs = (songs, req) => {
  return songs.map(song => {
    let url = song.audio_url || '';
    if (B2_BUCKET_URL && url.includes('/music/')) {
      const fileName = url.split('/music/')[1];
      if (fileName) {
        url = `${B2_BUCKET_URL.replace(/\/$/, '')}/${fileName}`;
      }
    } else if (url.startsWith('http://localhost:5000/music/')) {
      const fileName = url.split('/music/')[1];
      const isLocal = req && req.headers.host && req.headers.host.includes('localhost');
      url = isLocal ? `http://localhost:5000/music/${fileName}` : `/music/${fileName}`;
    }
    return {
      ...song,
      audio_url: url
    };
  });
};

router.get('/', (req, res) => {
  try {
    const language = req.query.language || 'all';
    let songs = getSongs();
    
    if (language !== 'all') {
      songs = songs.filter(s => s.language === language || 
        JSON.stringify(s).toLowerCase().includes(language.toLowerCase()));
    }
    
    res.json(mapSongs(songs, req));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/language/:lang', (req, res) => {
  const lang = req.params.lang;
  let songs = getSongs();
  songs = songs.filter(s => s.language === lang || 
    JSON.stringify(s).toLowerCase().includes(lang.toLowerCase()));
  res.json(mapSongs(songs));
});

module.exports = router;
