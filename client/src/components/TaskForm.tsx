import { useState } from 'react';
import { Task } from '@/lib/types';
import { generateId } from '@/lib/storage';

interface TaskFormProps {
  onCreateTask: (task: Task) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export default function TaskForm({ onCreateTask, onCancel, isVisible }: TaskFormProps) {
  const [text, setText] = useState('');
  const [rewardValue, setRewardValue] = useState<number>(1);
  const [errors, setErrors] = useState<{ text?: string; rewardValue?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { text?: string; rewardValue?: string } = {};
    
    if (!text.trim()) {
      newErrors.text = 'Please describe your task';
    }
    
    if (rewardValue < 1 || rewardValue > 50) {
      newErrors.rewardValue = 'Hearts must be between 1 and 50';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const newTask: Task = {
      id: generateId(),
      text: text.trim(),
      rewardValue
    };
    
    onCreateTask(newTask);
    setText('');
    setRewardValue(1);
    setErrors({});
  };

  const handleCancel = () => {
    setText('');
    setRewardValue(1);
    setErrors({});
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-teal border-opacity-30 animate-fade-in">
      <h3 className="text-xl font-semibold text-navy mb-4 flex items-center">
        <i className="fas fa-plus-circle text-teal mr-2"></i>
        Create New Task
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-navy font-semibold mb-2">What do you want to do?</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Clean my room, do homework, help with dishes..."
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
              errors.text 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-teal'
            }`}
          />
          {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
        </div>
        <div>
          <label className="block text-navy font-semibold mb-2">How many hearts is it worth?</label>
          <input
            type="number"
            min="1"
            max="50"
            value={rewardValue}
            onChange={(e) => setRewardValue(parseInt(e.target.value) || 1)}
            placeholder="5"
            className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
              errors.rewardValue 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-teal'
            }`}
          />
          {errors.rewardValue && <p className="text-red-500 text-sm mt-1">{errors.rewardValue}</p>}
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-teal hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold flex-1 text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <i className="fas fa-check mr-2"></i>Create Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold flex-1 text-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <i className="fas fa-times mr-2"></i>Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
