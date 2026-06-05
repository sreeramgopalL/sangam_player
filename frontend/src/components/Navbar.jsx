import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Disc, PlayCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: Disc },
    { path: '/player', label: 'Player', icon: PlayCircle },
  ];

  return (
    <>
      <nav className="bg-burgundy-dark text-beige-light p-4 sticky top-0 z-50 border-b border-burgundy shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Hamburger Menu Toggle */}
          <button 
            onClick={toggleMenu} 
            className="p-2 -ml-2 rounded-full hover:bg-white/10 hover:text-gold transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo Brand in Navbar */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Audio ArcS Logo" 
              className="w-9 h-9 rounded-xl object-cover border border-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.2)] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300"
            />
            <span className="text-2xl font-bold glitter-text tracking-wider">Audio ArcS</span>
          </Link>

          {/* Spacer/Right item placeholder for alignment */}
          <div className="w-9" />
        </div>
      </nav>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
          onClick={toggleMenu}
        />
      )}

      {/* Left Drawer / Sidebar Menu */}
      <div 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[80vw] backdrop-blur-2xl border-r border-white/10 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'linear-gradient(180deg, rgba(30, 6, 12, 0.95) 0%, rgba(15, 2, 5, 0.98) 100%)' }}
      >
        <div className="p-6 space-y-8">
          {/* Drawer Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Audio ArcS Logo" className="w-8 h-8 rounded-lg object-cover border border-gold/20" />
              <span className="text-lg font-bold text-white tracking-wide">Audio ArcS</span>
            </div>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-white/15 text-white/70 hover:text-gold transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold tracking-wide border transition-all duration-200 ${
                    isActive
                      ? 'bg-gold/15 border-gold/30 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                      : 'bg-transparent border-transparent text-beige hover:bg-white/5 hover:text-white hover:border-white/5'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-gold' : 'text-beige-dark'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="bg-burgundy-dark/30 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">Vibe App</p>
            <p className="text-xs text-beige-dark leading-relaxed">
              Experience unity in melody. Pick your mood and stream instantly.
            </p>
          </div>
          <p className="text-[10px] text-white/30 text-center">
            &copy; 2026 Audio ArcS. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
