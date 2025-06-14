import { AppState, Task, Reward } from './types';

const STORAGE_KEY = 'heart-rewards-app-state';

const defaultState: AppState = {
  hearts: 0,
  money: 0,
  tasks: [],
  rewards: [],
  claimedRewards: []
};

export const loadAppState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
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
