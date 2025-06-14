import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChildNamePromptProps {
  onNameSubmit: (name: string) => void;
}

export default function ChildNamePrompt({ onNameSubmit }: ChildNamePromptProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-navy mb-2">Welcome to Heart Rewards!</h2>
          <p className="text-gray-600">What's your name?</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="text-lg p-4 text-center"
            autoFocus
          />
          
          <Button
            type="submit"
            className="w-full bg-coral hover:bg-red-400 text-white text-lg py-3"
            disabled={!name.trim()}
          >
            Let's Start!
          </Button>
        </form>
      </div>
    </div>
  );
}