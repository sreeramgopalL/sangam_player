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
    
    // Map songs to Backblaze B2 if environment variable is set
    const B2_BUCKET_URL = process.env.B2_BUCKET_URL;
    if (B2_BUCKET_URL && result.songs) {
      result.songs = result.songs.map(song => {
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
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
