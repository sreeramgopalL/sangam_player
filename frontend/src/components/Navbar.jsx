import React from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-burgundy-dark text-beige-light p-4 sticky top-0 z-50 border-b border-burgundy shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Music className="text-gold group-hover:animate-spin" />
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
