export interface Task {
  id: string;
  text: string;
  rewardValue: number;
}

export interface Reward {
  id: string;
  text: string;
  cost: number;
}

export interface AppState {
  hearts: number;
  tasks: Task[];
  rewards: Reward[];
}
