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

// Ensure all audio URLs are relative (no localhost or cloud links)
const mapSongs = (songs) => {
  return songs.map(song => {
    let url = song.audio_url || '';
    // Strip any http://localhost:5000 prefix to make it relative
    if (url.startsWith('http://localhost')) {
      const urlObj = new URL(url);
      url = urlObj.pathname;
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
    
    res.json(mapSongs(songs));
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
