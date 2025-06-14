import { useEffect, useState, useRef } from 'react';

interface ConfettiEffectProps {
  isVisible: boolean;
  onComplete: () => void;
  duration?: number;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  drag: number;
  shape: 'rectangle' | 'circle' | 'star' | 'heart';
  opacity: number;
}

export default function ConfettiEffect({ isVisible, onComplete, duration = 5000 }: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const colors = [
    '#FF6B9D', // Pink
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Mint
    '#FECA57', // Yellow
    '#FF9F43', // Orange
    '#A8E6CF', // Light green
    '#FFB6C1', // Light pink
    '#87CEEB', // Sky blue
    '#DDA0DD'  // Plum
  ];

  const createConfettiPiece = (id: number): ConfettiPiece => {
    const shapes: ConfettiPiece['shape'][] = ['rectangle', 'circle', 'star', 'heart'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    return {
      id,
      x: Math.random() * window.innerWidth,
      y: window.innerHeight * 0.6, // Start from center-bottom area
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3, // Slower rotation
      width: Math.random() * 12 + 8, // Slightly larger pieces
      height: Math.random() * 12 + 8,
      velocityX: (Math.random() - 0.5) * 8, // More horizontal spread
      velocityY: -Math.random() * 8 - 5, // Strong upward initial velocity
      gravity: 0.015, // Much slower gravity
      drag: 0.992, // Less air resistance for smoother motion
      shape,
      opacity: 1
    };
  };

  const updateConfetti = (pieces: ConfettiPiece[], deltaTime: number): ConfettiPiece[] => {
    return pieces.map(piece => {
      // Apply gentle physics
      piece.velocityY += piece.gravity * deltaTime;
      piece.velocityX *= piece.drag;
      piece.velocityY *= piece.drag;

      // Add gentle flutter/drift
      piece.velocityX += Math.sin(Date.now() * 0.0005 + piece.id) * 0.01;

      // Update position with slower movement
      piece.x += piece.velocityX * deltaTime * 0.3; // Slower horizontal movement
      piece.y += piece.velocityY * deltaTime * 0.3; // Slower vertical movement

      // Update rotation
      piece.rotation += piece.rotationSpeed * deltaTime * 0.5; // Slower rotation

      // Fade out towards the very end
      const timeProgress = (Date.now() - (startTimeRef.current || 0)) / duration;
      if (timeProgress > 0.85) {
        piece.opacity = Math.max(0, 1 - (timeProgress - 0.85) / 0.15);
      }

      return piece;
    }).filter(piece =>
      piece.y < window.innerHeight + 100 &&
      piece.x > -100 &&
      piece.x < window.innerWidth + 100 &&
      piece.opacity > 0
    );
  };

  const animate = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const currentTime = Date.now();
    const elapsed = currentTime - startTimeRef.current;
    const deltaTime = 16; // Assume ~60fps

    if (elapsed < duration) {
      setConfetti(prevConfetti => updateConfetti(prevConfetti, deltaTime));
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setConfetti([]);
      onComplete();
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 80; i++) { // More pieces for dramatic effect
        pieces.push(createConfettiPiece(i));
      }
      setConfetti(pieces);
      startTimeRef.current = Date.now();

      // Start animation
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isVisible]);

  const getShapeElement = (piece: ConfettiPiece) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: piece.x,
      top: piece.y,
      transform: `rotate(${piece.rotation}deg)`,
      opacity: piece.opacity,
      pointerEvents: 'none' as const,
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))', // Add subtle shadow
    };

    switch (piece.shape) {
      case 'circle':
        return (
          <div
            style={{
              ...baseStyle,
              width: piece.width,
              height: piece.width,
              backgroundColor: piece.color,
              borderRadius: '50%',
            }}
          />
        );

      case 'star':
        return (
          <div
            style={{
              ...baseStyle,
              width: piece.width,
              height: piece.width,
              fontSize: piece.width,
              color: piece.color,
            }}
          >
            ⭐
          </div>
        );

      case 'heart':
        return (
          <div
            style={{
              ...baseStyle,
              width: piece.width,
              height: piece.width,
              fontSize: piece.width,
              color: piece.color,
            }}
          >
            ❤️
          </div>
        );

      default: // rectangle
        return (
          <div
            style={{
              ...baseStyle,
              width: piece.width,
              height: piece.height,
              backgroundColor: piece.color,
              borderRadius: '2px',
            }}
          />
        );
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confetti.map((piece) => (
        <div key={piece.id}>
          {getShapeElement(piece)}
        </div>
      ))}
    </div>
  );
}
