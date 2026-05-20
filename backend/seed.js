const fs = require('fs');
const path = require('path');

const languages = [
  { lang: 'tamil', term: 'anirudh ravichander' },
  { lang: 'tamil', term: 'ar rahman tamil' },
  { lang: 'hindi', term: 'arijit singh' },
  { lang: 'hindi', term: 'shreya ghoshal hindi' },
  { lang: 'telugu', term: 'devi sri prasad' },
  { lang: 'malayalam', term: 'malayalam hits' },
  { lang: 'kannada', term: 'kannada hits' },
  { lang: 'punjabi', term: 'diljit dosanjh' },
  { lang: 'english', term: 'pop hits' },
  { lang: 'english', term: 'the weeknd' }
];

async function seed() {
  let allSongs = [];
  
  for (const item of languages) {
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(item.term)}&entity=song&limit=15`);
      const data = await res.json();
      
      const mapped = data.results.filter(t => t.previewUrl).map(track => ({
        id: track.trackId.toString(),
        name: track.trackName,
        artists: [track.artistName],
        album: {
          name: track.collectionName,
          images: [{ url: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '500x500bb') : 'https://via.placeholder.com/500' }]
        },
        preview_url: track.previewUrl,
        external_urls: { spotify: track.trackViewUrl }, // Fallback to apple music url
        language: item.lang
      }));
      
      // Filter duplicates
      for (const track of mapped) {
        if (!allSongs.find(s => s.id === track.id)) {
          allSongs.push(track);
        }
      }
      
      console.log(`Fetched songs for ${item.lang} (${item.term})`);
    } catch (e) {
      console.error(`Error fetching for ${item.lang}:`, e);
    }
  }
  
  const cachePath = path.join(__dirname, 'cache', 'songsCache.json');
  if (!fs.existsSync(path.dirname(cachePath))) {
    fs.mkdirSync(path.dirname(cachePath));
  }
  fs.writeFileSync(cachePath, JSON.stringify(allSongs, null, 2));
  console.log(`\n✅ Successfully seeded ${allSongs.length} real songs with 30s previews into the cache!`);
}

seed();
