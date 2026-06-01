import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  taskFilter: 'all' | 'todo' | 'in_progress' | 'completed' | 'urgent';
  setTaskFilter: (filter: 'all' | 'todo' | 'in_progress' | 'completed' | 'urgent') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      taskFilter: 'all',
      setTaskFilter: (filter) => set({ taskFilter: filter }),
    }),
    {
      name: 'zyra-ui-storage', // saves theme in localStorage
    }
  )
);
