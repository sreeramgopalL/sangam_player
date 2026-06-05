import React, { useState, useEffect, useRef } from 'react';
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
      const saved = localStorage.getItem('audio_arcs_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('audio_arcs_favorites', JSON.stringify(favorites));
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

  // Auto-play when song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.audio_url) {
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setProgress(0);
    setCurrentTime(0);
    handleNextSong();
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
            <Route 
              path="/" 
              element={
                <Home 
                  setCurrentSong={setCurrentSong} 
                  currentSong={currentSong} 
                  setSharedPlaylist={setSharedPlaylist} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            <Route 
              path="/player" 
              element={
                <PlayerPage 
                  sharedPlaylist={sharedPlaylist} 
                  setCurrentSong={setCurrentSong} 
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  progress={progress}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  setVolume={setVolume}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  audioRef={audioRef}
                  onNext={handleNextSong}
                  onPrev={handlePrevSong}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
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

        {/* Global active audio element */}
        {currentSong?.audio_url && (
          <audio
            ref={audioRef}
            src={currentSong.audio_url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />
        )}

        <MusicPlayer 
          currentSong={currentSong} 
          playlist={sharedPlaylist?.songs || []}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          progress={progress}
          audioRef={audioRef}
        />
      </div>
    </Router>
  );
}

export default App;
