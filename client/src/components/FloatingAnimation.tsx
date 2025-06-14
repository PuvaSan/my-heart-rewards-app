import { useEffect, useState } from 'react';

interface FloatingAnimationProps {
  isVisible: boolean;
  startPosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  content: React.ReactNode;
  onComplete: () => void;
  duration?: number;
}

export default function FloatingAnimation({ 
  isVisible, 
  startPosition, 
  targetPosition, 
  content, 
  onComplete,
  duration = 1200
}: FloatingAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        className="absolute text-3xl font-bold transition-all ease-out animate-float-to-target"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          '--start-x': `${startPosition.x}px`,
          '--start-y': `${startPosition.y}px`,
          '--end-x': `${targetPosition.x}px`,
          '--end-y': `${targetPosition.y}px`,
          '--duration': `${duration}ms`
        } as React.CSSProperties}
      >
        {content}
      </div>
    </div>
  );
}