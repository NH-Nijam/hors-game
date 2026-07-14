import { create } from 'zustand';

interface GameState {
  // Game Status
  isPlaying: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  
  // Stats
  distance: number;
  score: number;
  coins: number;
  speed: number;
  
  // Environment
  environment: 'forest' | 'village' | 'desert' | 'snow' | 'night' | 'volcano';
  
  // Power Ups (Active Durations or States)
  hasMagnet: boolean;
  hasShield: boolean;
  isDoubleCoins: boolean;
  isBoosting: boolean;
  
  // Triggers for 3D components
  jumpTrigger: number;
  slideTrigger: number;
  
  // Physics State for Collision Detection (read-only for most, updated by Player in useFrame)
  playerY: number;
  isPlayerSliding: boolean;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  resetGame: () => void;
  
  // Ticks
  addDistance: (amount: number) => void;
  addCoin: (amount?: number) => void;
  increaseSpeed: (amount: number) => void;
  activateBoost: () => void;
  deactivateBoost: () => void;
  
  triggerJump: () => void;
  triggerSlide: () => void;
}

const INITIAL_SPEED = 5;
const MAX_SPEED = 15;

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  isGameOver: false,
  isPaused: false,
  
  distance: 0,
  score: 0,
  coins: 0,
  speed: INITIAL_SPEED,
  
  environment: 'forest',
  
  hasMagnet: false,
  hasShield: false,
  isDoubleCoins: false,
  isBoosting: false,
  
  jumpTrigger: 0,
  slideTrigger: 0,
  playerY: 0,
  isPlayerSliding: false,

  startGame: () => set({ isPlaying: true, isGameOver: false, isPaused: false, distance: 0, score: 0, speed: INITIAL_SPEED }),
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  gameOver: () => set({ isGameOver: true, isPlaying: false }),
  resetGame: () => set({ 
    isPlaying: false, 
    isGameOver: false, 
    isPaused: false, 
    distance: 0, 
    score: 0, 
    speed: INITIAL_SPEED,
    hasMagnet: false,
    hasShield: false,
    isDoubleCoins: false,
    isBoosting: false,
    jumpTrigger: 0,
    slideTrigger: 0,
    playerY: 0,
    isPlayerSliding: false,
  }),
  
  addDistance: (amount) => set((state) => {
    const newDistance = state.distance + amount;
    const newScore = Math.floor(newDistance);
    
    // Environment Switching
    let newEnv = state.environment;
    if (newDistance < 1000) newEnv = 'forest';
    else if (newDistance < 2000) newEnv = 'village';
    else if (newDistance < 3000) newEnv = 'desert';
    else if (newDistance < 4000) newEnv = 'snow';
    else if (newDistance < 5000) newEnv = 'night';
    else newEnv = 'volcano';
    
    // Speed progression
    const newSpeed = Math.min(MAX_SPEED, INITIAL_SPEED + Math.floor(newDistance / 500));

    return { distance: newDistance, score: newScore, environment: newEnv, speed: newSpeed };
  }),
  
  addCoin: (amount = 1) => set((state) => ({ 
    coins: state.coins + (state.isDoubleCoins ? amount * 2 : amount) 
  })),

  increaseSpeed: (amount) => set((state) => ({
    speed: Math.min(state.speed + amount, MAX_SPEED)
  })),

  activateBoost: () => set((state) => {
    if (state.coins >= 10 && !state.isBoosting) {
      setTimeout(() => {
        useGameStore.getState().deactivateBoost();
      }, 3000);
      return { isBoosting: true, coins: state.coins - 10 };
    }
    return state;
  }),
  
  deactivateBoost: () => set({ isBoosting: false }),
  
  triggerJump: () => set((state) => ({ jumpTrigger: state.jumpTrigger + 1 })),
  triggerSlide: () => set((state) => ({ slideTrigger: state.slideTrigger + 1 })),
}));
