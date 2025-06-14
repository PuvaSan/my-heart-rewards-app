import { AppState, Task, Reward } from './types';

const STORAGE_KEY = 'heart-rewards-app-state';

const defaultState: AppState = {
  childName: '',
  currency: 'YEN',
  hearts: 0,
  money: 0,
  tasks: [],
  rewards: [],
  claimedRewards: [],
  activityHistory: [],
  purchases: []
};

export const loadAppState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedState = JSON.parse(stored);
      // Migrate old data format to new format
      return {
        childName: parsedState.childName || '',
        currency: parsedState.currency || 'YEN',
        hearts: parsedState.hearts || 0,
        money: parsedState.money || 0,
        tasks: parsedState.tasks || [],
        rewards: parsedState.rewards || [],
        claimedRewards: parsedState.claimedRewards || [],
        activityHistory: parsedState.activityHistory || [],
        purchases: parsedState.purchases || []
      };
    }
  } catch (error) {
    console.error('Error loading app state from localStorage:', error);
  }
  return defaultState;
};

export const saveAppState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state to localStorage:', error);
  }
};

export const generateId = (): string => {
  return crypto.randomUUID();
};
