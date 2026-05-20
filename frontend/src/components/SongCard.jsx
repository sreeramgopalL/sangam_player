import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { useGlitter } from '../hooks/useGlitter';

const SongCard = ({ song, onPlay }) => {
  const { triggerBurst } = useGlitter();

  const handlePlay = (e) => {
    triggerBurst(e.clientX, e.clientY);
    onPlay(song);
  };

  return (
    <div className="glass-card p-4 hover:bg-beige-light/10 transition-all duration-300 group border-l-4 border-l-burgundy-light hover:border-l-gold relative overflow-hidden">
      {/* Shimmer effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-xl transition-all duration-500 pointer-events-none" />
      
      <div className="flex gap-4 items-center">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={song.album?.images?.[0]?.url || 'https://via.placeholder.com/64'} 
            alt={song.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button onClick={handlePlay} className="text-gold hover:scale-110 transition-transform">
              <Play fill="currentColor" size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-beige truncate">{song.name}</h3>
          <p className="text-sm text-beige-dark truncate">{song.artists?.join(', ')}</p>
          {song.language && <span className="text-xs px-2 py-1 bg-burgundy rounded-full text-gold mt-1 inline-block capitalize">{song.language}</span>}
        </div>
        
        <div className="flex-shrink-0">
          <a 
            href={song.audio_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-beige-dark hover:text-gold transition-colors p-2 inline-block"
            title="Download/Open Audio"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
