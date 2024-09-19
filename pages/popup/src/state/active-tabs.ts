import { create } from 'zustand';

type ChromeTab = { title: string; url: string; favIconUrl: string };

type ActiveTabsState = {
  activeWindow: ChromeTab[] | null;
  activeTab: ChromeTab | null;
  setActiveWindow: (tabs: ChromeTab[]) => void;
  setActiveTab: (tab: ChromeTab) => void;
};

export const useActiveTabsStore = create<ActiveTabsState>(set => ({
  activeWindow: null,
  activeTab: null,
  setActiveWindow: (tabs: ChromeTab[]) => set(state => ({ ...state, activeWindow: tabs })),
  setActiveTab: (tab: ChromeTab) => set(state => ({ ...state, activeTab: tab })),
}));
