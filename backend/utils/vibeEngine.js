const vibeMap = {
  "party": { targetEnergy: 0.8, targetDanceability: 0.8, genres: ["tamil", "punjabi", "english"] },
  "sad": { targetEnergy: 0.2, targetValence: 0.2, genres: ["hindi", "tamil", "english"] },
  "romantic": { targetEnergy: 0.4, targetValence: 0.7, genres: ["tamil", "hindi", "telugu"] },
  "workout": { targetEnergy: 0.9, targetDanceability: 0.7, genres: ["tamil", "english", "punjabi"] },
  "focus": { targetEnergy: 0.3, targetAcousticness: 0.8, genres: ["instrumental", "lofi"] },
  "travel": { targetEnergy: 0.6, targetValence: 0.6, genres: ["all"] },
  "devotional": { targetEnergy: 0.3, targetAcousticness: 0.9, genres: ["tamil", "telugu", "hindi"] }
};

const detectVibe = (text) => {
  const lowercaseText = text.toLowerCase();
  
  for (const [vibe, data] of Object.entries(vibeMap)) {
    if (lowercaseText.includes(vibe)) {
      return { vibe, ...data };
    }
  }
  
  // Default balanced vibe
  return { 
    vibe: "mixed", 
    targetEnergy: 0.5, 
    targetValence: 0.5,
    genres: ["all"]
  };
};

const generateVibePlaylist = (userText, cachedSongs, languagePreference = "all") => {
  const vibeData = detectVibe(userText);
  let pool = [...cachedSongs];
  
  // Shuffle pool to get random mix
  pool = pool.sort(() => 0.5 - Math.random());
  
  // In a real application, you'd match audio features (energy, valence) provided by Spotify's Audio Features API.
  // Here we simulate matching by filtering based on genres/languages associated with songs.
  // Assuming our cached songs have an internal 'language' property we inject or infer from artists.
  
  // If we don't have enough songs, just return what we have (up to 15)
  if (pool.length === 0) return [];
  
  const targetCount = 15;
  let playlist = [];

  // Very basic matching simulation:
  for (const song of pool) {
    if (playlist.length >= targetCount) break;
    // Just add randomly to simulate vibe for now
    playlist.push(song);
  }

  return {
    playlist,
    vibeDescription: `A ${vibeData.vibe} mix for you.`
  };
};

module.exports = {
  generateVibePlaylist,
  detectVibe,
  vibeMap
};
