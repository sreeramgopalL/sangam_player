import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Footer from './components/Footer';
import GlitterEffect from './components/GlitterEffect';
import Home from './pages/Home';
import PlayerPage from './pages/PlayerPage';
import Library from './pages/Library';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [sharedPlaylist, setSharedPlaylist] = useState(null); // { songs: [], description: "", vibeText: "" }
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('sangam_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sangam_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (song) => {
    if (!song) return;
    setFavorites(prev => {
      const exists = prev.some(s => s.id === song.id);
      if (exists) {
        return prev.filter(s => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  const handleNextSong = () => {
    if (!sharedPlaylist || !sharedPlaylist.songs || sharedPlaylist.songs.length === 0) return;
    const currentIndex = sharedPlaylist.songs.findIndex(s => s.id === currentSong?.id);
    if (currentIndex !== -1 && currentIndex < sharedPlaylist.songs.length - 1) {
      setCurrentSong(sharedPlaylist.songs[currentIndex + 1]);
    } else {
      // Loop or stop
      setCurrentSong(sharedPlaylist.songs[0]);
    }
  };

  const handlePrevSong = () => {
    if (!sharedPlaylist || !sharedPlaylist.songs || sharedPlaylist.songs.length === 0) return;
    const currentIndex = sharedPlaylist.songs.findIndex(s => s.id === currentSong?.id);
    if (currentIndex > 0) {
      setCurrentSong(sharedPlaylist.songs[currentIndex - 1]);
    } else {
      setCurrentSong(sharedPlaylist.songs[sharedPlaylist.songs.length - 1]);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-burgundy-deep text-beige-light font-sans relative overflow-x-hidden selection:bg-gold selection:text-burgundy-deep">
        {/* Dynamic Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-burgundy/30 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-burgundy-light/20 blur-[120px] mix-blend-screen" />
        </div>

        <GlitterEffect />
        <Navbar />

        <main className="relative z-10 min-h-[70vh]">
          <Routes>
            <Route path="/" element={<Home setSharedPlaylist={setSharedPlaylist} />} />
            <Route 
              path="/player" 
              element={
                <PlayerPage 
                  sharedPlaylist={sharedPlaylist} 
                  setCurrentSong={setCurrentSong} 
                  currentSong={currentSong}
                />
              } 
            />
            <Route 
              path="/library" 
              element={
                <Library 
                  setCurrentSong={setCurrentSong}
                  setSharedPlaylist={setSharedPlaylist}
                />
              } 
            />
          </Routes>
        </main>

        <Footer />

        <MusicPlayer 
          currentSong={currentSong} 
          playlist={sharedPlaylist?.songs || []}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </Router>
  );
}

export default App;
