import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import GlitterEffect from './components/GlitterEffect';
import Home from './pages/Home';
import PlayerPage from './pages/PlayerPage';
import Library from './pages/Library';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [sharedPlaylist, setSharedPlaylist] = useState(null); // { songs: [], description: "", vibeText: "" }

  const handleNextSong = () => {
    if (!sharedPlaylist || !sharedPlaylist.songs) return;
    const currentIndex = sharedPlaylist.songs.findIndex(s => s.id === currentSong?.id);
    if (currentIndex !== -1 && currentIndex < sharedPlaylist.songs.length - 1) {
      setCurrentSong(sharedPlaylist.songs[currentIndex + 1]);
    } else {
      // Loop or stop
      setCurrentSong(sharedPlaylist.songs[0]);
    }
  };

  const handlePrevSong = () => {
    if (!sharedPlaylist || !sharedPlaylist.songs) return;
    const currentIndex = sharedPlaylist.songs.findIndex(s => s.id === currentSong?.id);
    if (currentIndex > 0) {
      setCurrentSong(sharedPlaylist.songs[currentIndex - 1]);
    } else {
      setCurrentSong(sharedPlaylist.songs[sharedPlaylist.songs.length - 1]);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-burgundy-deep text-beige-light font-sans relative overflow-x-hidden selection:bg-gold selection:text-burgundy-deep pb-24">
        {/* Dynamic Background Effects */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-burgundy/30 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-burgundy-light/20 blur-[120px] mix-blend-screen" />
        </div>

        <GlitterEffect />
        <Navbar />

        <main className="relative z-10">
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
                  setCurrentSong={(song) => {
                    setCurrentSong(song);
                    if (!sharedPlaylist) {
                      setSharedPlaylist({ songs: [song], description: "Library Selection", vibeText: "Library" });
                    }
                  }} 
                />
              } 
            />
          </Routes>
        </main>

        <MusicPlayer 
          currentSong={currentSong} 
          playlist={sharedPlaylist?.songs || []}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
        />
      </div>
    </Router>
  );
}

export default App;
