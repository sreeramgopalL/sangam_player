import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VibeInput from '../components/VibeInput';
import { useSpotify } from '../hooks/useSpotify';

const Home = ({ setSharedPlaylist }) => {
  const navigate = useNavigate();
  const { generatePlaylist, loading } = useSpotify();

  const handleVibeSubmit = async (text) => {
    const result = await generatePlaylist(text);
    if (result && result.playlist) {
      setSharedPlaylist({
        songs: result.playlist,
        description: result.vibeDescription,
        vibeText: text
      });
      navigate('/player');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="text-center mb-12 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
        <img 
          src="/logo.png" 
          alt="Sangam Player Logo" 
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.35)] mb-6 hover:scale-105 hover:rotate-2 transition-all duration-300"
        />
        <h1 className="text-5xl md:text-7xl font-bold mb-6 glitter-text">
          SANGAM PLAYER
        </h1>
        <p className="text-xl text-beige max-w-2xl mx-auto drop-shadow-md bg-burgundy-deep/40 p-4 rounded-xl backdrop-blur-sm">
          Discover magical vibes across all languages. Just tell us how you're feeling, and we'll craft the perfect playlist.
        </p>
      </div>

      <div className="w-full z-10 animate-in fade-in zoom-in-95 duration-1000 delay-300">
        <VibeInput onSubmit={handleVibeSubmit} isLoading={loading} />
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        {[
          { title: "Multi-Lingual", desc: "Tamil, Hindi, Telugu, Malayalam, Kannada, Punjabi, English" },
          { title: "AI Vibes", desc: "Smart mood matching based on your exact text or voice input" },
          { title: "Real Music", desc: "Powered by Spotify. Listen to real 30s previews of premium tracks" }
        ].map((feature, idx) => (
          <div key={idx} className="glass-card p-6 text-center group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold text-gold mb-2">{feature.title}</h3>
            <p className="text-beige-dark">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
