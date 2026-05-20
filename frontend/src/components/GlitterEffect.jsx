import React from 'react';
import { useGlitter } from '../hooks/useGlitter';

const GlitterEffect = () => {
  const { sparkles } = useGlitter();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle animate-float-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            backgroundColor: Math.random() > 0.5 ? '#D4AF37' : '#F5F5DC',
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
        />
      ))}
    </div>
  );
};

export default GlitterEffect;
