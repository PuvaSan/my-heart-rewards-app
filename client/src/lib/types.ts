export interface Task {
  id: string;
  text: string;
  rewardValue: number;
}

export interface Reward {
  id: string;
  text: string;
  cost: number;
  moneyValue?: number; // Optional money value that can be collected after claiming
}

export interface ActivityEntry {
  id: string;
  type: 'task_completed' | 'reward_claimed' | 'money_collected';
  timestamp: number;
  description: string;
  heartsEarned?: number;
  heartsSpent?: number;
  moneyEarned?: number;
}

export interface AppState {
  hearts: number;
  money: number;
  tasks: Task[];
  rewards: Reward[];
  claimedRewards: string[]; // Track which rewards have been claimed but not yet collected for money
  activityHistory: ActivityEntry[];
}
