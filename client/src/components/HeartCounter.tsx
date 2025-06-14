interface HeartCounterProps {
  hearts: number;
}

export default function HeartCounter({ hearts }: HeartCounterProps) {
  return (
    <div className="bg-coral text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-xl font-bold">
      <i className="fas fa-heart text-2xl animate-heart-beat"></i>
      <span>{hearts}</span>
    </div>
  );
}
