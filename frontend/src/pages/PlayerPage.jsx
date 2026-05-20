import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistPanel from '../components/PlaylistPanel';

const PlayerPage = ({ sharedPlaylist, setCurrentSong, currentSong }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sharedPlaylist || sharedPlaylist.songs.length === 0) {
      navigate('/');
    }
  }, [sharedPlaylist, navigate]);

  if (!sharedPlaylist) return null;

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="glass-card p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
        <h1 className="text-3xl font-bold text-beige mb-2">Your Vibe</h1>
        <p className="text-xl text-gold italic">"{sharedPlaylist.vibeText}"</p>
        <p className="text-beige-dark mt-2">{sharedPlaylist.description}</p>
      </div>

      <PlaylistPanel 
        songs={sharedPlaylist.songs} 
        onPlaySong={setCurrentSong} 
        title="Generated Mix"
      />
    </div>
  );
};

export default PlayerPage;
