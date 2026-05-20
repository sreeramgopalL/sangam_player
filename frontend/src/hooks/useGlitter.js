import { useEffect, useState } from 'react';

export const useGlitter = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    let timeoutId;
    
    const handleMouseMove = (e) => {
      if (Math.random() > 0.9) { // Only create sparkle on some moves
        const id = Date.now() + Math.random();
        setSparkles(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        
        // Remove sparkle after animation
        timeoutId = setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== id));
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  const triggerBurst = (x, y) => {
    const newSparkles = Array.from({ length: 10 }).map(() => ({
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
    }));
    
    setSparkles(prev => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 2000);
  };

  return { sparkles, triggerBurst };
};
