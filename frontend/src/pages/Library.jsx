// frontend/src/pages/Library.jsx
import React, { useEffect } from 'react';
import PlaylistPanel from '../components/PlaylistPanel';
import { useSpotify } from '../hooks/useSpotify';
import { Loader2, Cloud, HardDrive } from 'lucide-react';

// Library page – displays local files or Google Drive files dynamically
const Library = ({ setCurrentSong }) => {
  const { songs, loading, error, fetchLibrarySongs } = useSpotify();

  // Load library songs on component mount only
  useEffect(() => {
    fetchLibrarySongs();
    // eslint-disable-next-line
  }, []);

  const isCloud = songs.length > 0 && songs[0].id && songs[0].id.startsWith('drive_');

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 glitter-text">Music Library</h1>
        <p className="text-beige-dark">Explore hits across all sources</p>

        {/* Dynamic Source label */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border bg-gold border-gold text-burgundy-deep shadow-lg shadow-gold/20 font-medium"
            disabled
          >
            {isCloud ? <Cloud size={18} /> : <HardDrive size={18} />}
            {isCloud ? 'Google Drive (Full Songs)' : 'Local Music Folder'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-gold" size={48} />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-400 bg-red-900/20 rounded-xl border border-red-900/50">
          <p>Error loading songs: {error}</p>
        </div>
      ) : (
        <PlaylistPanel
          songs={songs}
          onPlaySong={setCurrentSong}
          title={isCloud ? "Google Drive Playlist" : "Local Music Playlist"}
        />
      )}
    </div>
  );
};

export default Library;

