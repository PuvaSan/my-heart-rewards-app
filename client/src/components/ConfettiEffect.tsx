import { useEffect, useState } from 'react';

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
  size: number;
  velocityX: number;
  velocityY: number;
}

export default function ConfettiEffect({ isVisible, onComplete, duration = 3000 }: ConfettiEffectProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9F43'];

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          size: Math.random() * 10 + 5,
          velocityX: (Math.random() - 0.5) * 4,
          velocityY: Math.random() * 3 + 2
        });
      }
      setConfetti(pieces);

      const timer = setTimeout(() => {
        setConfetti([]);
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, duration]);

  if (!isVisible || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            animation: `confettiFall ${duration / 1000}s linear forwards`
          }}
        />
      ))}
    </div>
  );
}