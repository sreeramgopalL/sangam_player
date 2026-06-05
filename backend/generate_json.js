const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const NodeID3 = require('node-id3');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const musicDir = process.env.MUSIC_DIR || path.join(__dirname, 'public', 'music');
const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'songs.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

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

function detectLanguage(tags, file) {
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
  const searchStr = [
    tags?.title || '',
    tags?.artist || '',
    tags?.album || '',
    tags?.genre || '',
    file
  ].join(' ').toLowerCase();

  for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    if (keywords.some(k => searchStr.includes(k))) return lang;
  }
  return 'tamil';
}

function detectVibe(tags, file) {
  const searchStr = [
    tags?.title || '',
    tags?.genre || '',
    file
  ].join(' ').toLowerCase();

  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS)) {
    if (keywords.some(k => searchStr.includes(k))) return vibe;
  }
  return 'energetic';
}

if (!fs.existsSync(musicDir)) {
  console.log(`Music directory does not exist: ${musicDir}`);
  process.exit(1);
}

const files = fs.readdirSync(musicDir).filter(f => f.toLowerCase().endsWith('.mp3'));

const songs = files.map((file, index) => {
  let tags = {};
  try {
    tags = NodeID3.read(path.join(musicDir, file)) || {};
  } catch (_) {}

  const title = (tags.title || file.replace(/\.mp3$/i, '')).replace(/[-_]/g, ' ');
  const artist = tags.artist || tags.performerInfo || 'Unknown Artist';
  const language = detectLanguage(tags, file);
  const vibe = detectVibe(tags, file);

  return {
    id: (index + 1).toString(),
    name: title,
    artists: [artist],
    album: {
      images: [{"url": `/api/songs/cover/${encodeURIComponent(file)}`}]
    },
    audio_url: `/music/${encodeURIComponent(file)}`,
    language: language,
    vibe: vibe
  };
});

fs.writeFileSync(outputFile, JSON.stringify(songs, null, 2));
console.log(`Generated ${songs.length} songs in data/songs.json`);

