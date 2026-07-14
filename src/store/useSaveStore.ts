import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SaveState {
  coins: number;
  bestScore: number;
  bestDistance: number;
  
  // Upgrades (Level 1-5 for example)
  speedLevel: number;
  jumpHeightLevel: number;
  boostDurationLevel: number;
  magnetDurationLevel: number;
  shieldDurationLevel: number;
  
  // Horses
  unlockedHorses: string[];
  currentHorse: string;
  
  // Settings
  musicEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkTheme: boolean;

  // Actions
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  updateBestScore: (score: number, distance: number) => void;
  unlockHorse: (horseId: string, cost: number) => boolean;
  selectHorse: (horseId: string) => void;
  upgradeSkill: (skill: keyof SaveState, cost: number) => boolean;
  toggleSetting: (setting: 'musicEnabled' | 'soundEnabled' | 'vibrationEnabled' | 'darkTheme') => void;
}

export const useSaveStore = create<SaveState>()(
  persist(
    (set, get) => ({
      coins: 0,
      bestScore: 0,
      bestDistance: 0,
      
      speedLevel: 1,
      jumpHeightLevel: 1,
      boostDurationLevel: 1,
      magnetDurationLevel: 1,
      shieldDurationLevel: 1,
      
      unlockedHorses: ['brown_horse'],
      currentHorse: 'brown_horse',
      
      musicEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      darkTheme: true,
      
      addCoins: (amount) => set({ coins: get().coins + amount }),
      
      spendCoins: (amount) => {
        const currentCoins = get().coins;
        if (currentCoins >= amount) {
          set({ coins: currentCoins - amount });
          return true;
        }
        return false;
      },
      
      updateBestScore: (score, distance) => set((state) => ({
        bestScore: Math.max(state.bestScore, score),
        bestDistance: Math.max(state.bestDistance, distance)
      })),
      
      unlockHorse: (horseId, cost) => {
        const state = get();
        if (state.coins >= cost && !state.unlockedHorses.includes(horseId)) {
          set({ 
            coins: state.coins - cost,
            unlockedHorses: [...state.unlockedHorses, horseId]
          });
          return true;
        }
        return false;
      },
      
      selectHorse: (horseId) => {
        if (get().unlockedHorses.includes(horseId)) {
          set({ currentHorse: horseId });
        }
      },
      
      upgradeSkill: (skill, cost) => {
        const state = get();
        if (state.coins >= cost) {
          const currentLevel = state[skill] as number;
          if (currentLevel < 5) {
            set({ 
              coins: state.coins - cost,
              [skill]: currentLevel + 1
            } as Partial<SaveState>);
            return true;
          }
        }
        return false;
      },
      
      toggleSetting: (setting) => set((state) => ({
        [setting]: !state[setting]
      }))
    }),
    {
      name: 'horse-runner-save',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
