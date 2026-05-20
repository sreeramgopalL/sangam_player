import React from 'react';
import SongCard from './SongCard';

const PlaylistPanel = ({ songs, onPlaySong, title = "Your Playlist" }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gold glitter-text">{title}</h2>
      {songs && songs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
          {songs.map((song, idx) => (
            <div key={`${song.id}-${idx}`} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
              <SongCard song={song} onPlay={onPlaySong} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-card border-dashed">
          <p className="text-beige-dark">No songs found. Try a different vibe or language.</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistPanel;
