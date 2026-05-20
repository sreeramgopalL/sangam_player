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

router.get('/', (req, res) => {
  try {
    const language = req.query.language || 'all';
    let songs = getSongs();
    
    if (language !== 'all') {
      songs = songs.filter(s => s.language === language || 
        JSON.stringify(s).toLowerCase().includes(language.toLowerCase()));
    }
    
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/language/:lang', (req, res) => {
  const lang = req.params.lang;
  let songs = getSongs();
  songs = songs.filter(s => s.language === lang || 
    JSON.stringify(s).toLowerCase().includes(lang.toLowerCase()));
  res.json(songs);
});

module.exports = router;
