const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { generateVibePlaylist } = require('../utils/vibeEngine');
const { detectLanguage } = require('../utils/languageDetector');

const getSongs = () => {
  const songsPath = path.join(__dirname, '../data/songs.json');
  if (fs.existsSync(songsPath)) {
    return JSON.parse(fs.readFileSync(songsPath, 'utf8'));
  }
  return [];
};

router.post('/generate', async (req, res) => {
  try {
    const { text, languagePreference } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text input is required to detect vibe' });
    }

    const detectedLang = languagePreference || detectLanguage(text);
    
    // Get all songs
    let cachedSongs = getSongs();

    const result = generateVibePlaylist(text, cachedSongs, detectedLang);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
