import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="bg-burgundy-dark text-beige-light p-4 sticky top-0 z-50 border-b border-burgundy shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={logo} 
            alt="Sangam Player Logo" 
            className="w-9 h-9 rounded-xl object-cover border border-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.2)] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300"
          />
          <span className="text-2xl font-bold glitter-text tracking-wider">SANGAM PLAYER</span>
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-gold transition-colors font-medium">Home</Link>
          <Link to="/library" className="hover:text-gold transition-colors font-medium">Library</Link>
          <Link to="/player" className="hover:text-gold transition-colors font-medium">Player</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
