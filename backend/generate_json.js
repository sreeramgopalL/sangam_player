const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const musicDir = process.env.MUSIC_DIR || path.join(__dirname, 'public', 'music');
const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'songs.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const files = fs.readdirSync(musicDir).filter(f => f.toLowerCase().endsWith('.mp3'));


const songs = files.map((file, index) => {
  const name = file.replace('.mp3', '');
  return {
    id: (index + 1).toString(),
    name: name,
    artists: ["Unknown Artist"], // Default artist
    album: {
      images: [{"url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80"}]
    },
    audio_url: `http://localhost:5000/music/${encodeURIComponent(file)}`,
    language: "tamil", // Set a default language
    vibe: "energetic" // Set a default vibe
  };
});

fs.writeFileSync(outputFile, JSON.stringify(songs, null, 2));
console.log(`Generated ${songs.length} songs in data/songs.json`);
