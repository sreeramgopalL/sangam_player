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

const mapSongs = (songs) => {
  if (!B2_BUCKET_URL) return songs;
  return songs.map(song => {
    if (song.audio_url && song.audio_url.includes('/music/')) {
      const fileName = song.audio_url.split('/music/')[1];
      if (fileName) {
        return {
          ...song,
          audio_url: `${B2_BUCKET_URL.replace(/\/$/, '')}/${fileName}`
        };
      }
    }
    return song;
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
