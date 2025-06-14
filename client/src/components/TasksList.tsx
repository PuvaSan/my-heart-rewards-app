import { Task } from '@/lib/types';

interface TasksListProps {
  tasks: Task[];
  onCompleteTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TasksList({ tasks, onCompleteTask, onDeleteTask }: TasksListProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-l-4 border-gray-300">
        <i className="fas fa-tasks text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet!</h3>
        <p className="text-gray-500">Add your first task to start earning hearts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal hover:shadow-xl transition-all duration-200 animate-fade-in">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-navy mb-2">{task.text}</h3>
              <div className="flex items-center space-x-2 text-teal font-semibold">
                <i className="fas fa-heart"></i>
                <span>{task.rewardValue}</span>
                <span className="text-gray-600">hearts</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onCompleteTask(task)}
                className="bg-coral hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <i className="fas fa-heart"></i>
                <span>Get Hearts!</span>
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                title="Delete task"
              >
                <i className="fas fa-trash text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
