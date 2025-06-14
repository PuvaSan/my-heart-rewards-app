interface SuccessOverlayProps {
  isVisible: boolean;
  message: string;
  subMessage?: string;
  onClose: () => void;
}

export default function SuccessOverlay({ isVisible, message, subMessage, onClose }: SuccessOverlayProps) {
  if (!isVisible) return null;

  // Auto-close after 2 seconds
  setTimeout(() => {
    onClose();
  }, 2000);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="text-center animate-bounce-gentle">
        <i className="fas fa-heart text-8xl text-coral mb-4"></i>
        <h2 className="text-4xl font-bold text-white mb-2">{message}</h2>
        {subMessage && <p className="text-xl text-white">{subMessage}</p>}
      </div>
    </div>
  );
}
