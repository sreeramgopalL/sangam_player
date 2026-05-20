import React, { useState, useEffect } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { useGlitter } from '../hooks/useGlitter';

const VibeInput = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { triggerBurst } = useGlitter();

  useEffect(() => {
    // Check speech recognition support
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  }, []);

  const handleVoice = (e) => {
    e.preventDefault();
    if (!window.SpeechRecognition) {
      alert("Your browser does not support voice input. Try Chrome.");
      return;
    }

    const recognition = new window.SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Could be dynamic based on selection

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    // Trigger large glitter burst on submit
    const rect = e.target.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    onSubmit(text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-burgundy via-gold to-burgundy rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <div className="relative glass-card rounded-full flex items-center p-2 pr-4 pl-6 bg-burgundy-dark/80">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell me your vibe... (e.g. 'Tamil romantic songs for a rainy day')"
            className="flex-grow bg-transparent border-none outline-none text-beige placeholder-beige-dark/50 p-2"
            disabled={isLoading}
          />
          
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleVoice}
              className={`p-3 rounded-full transition-all ${isListening ? 'bg-gold text-burgundy animate-pulse shadow-[0_0_15px_gold]' : 'text-beige hover:text-gold hover:bg-burgundy-light'}`}
              title="Voice Input"
            >
              <Mic size={20} />
            </button>
            
            <button 
              type="submit" 
              disabled={isLoading || !text.trim()}
              className="p-3 bg-gradient-to-r from-burgundy to-burgundy-light border border-gold/30 rounded-full text-gold hover:text-beige-light hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:animate-shimmer"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VibeInput;
