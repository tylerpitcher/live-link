import { create } from 'zustand';

const user = JSON.parse(localStorage.getItem('user'));

const useUserStore = create((set) => ({
  user,
  darkMode: true,
  setUser: (user) => set({ user }),
  changeDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

export default useUserStore;
