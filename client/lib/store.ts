import { create } from "zustand";

export type TabType = "Futures" | "Perps" | "Options";

interface DeriverseState {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    executionModalOpen: boolean;
    openExecutionModal: () => void;
    closeExecutionModal: () => void;

    journalPage: number;
    setJournalPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;

    isPortfolioActive: boolean;
    setIsPortfolioActive: (active: boolean) => void;

    aiInsightOpen: boolean;
    setAiInsightOpen: (open: boolean) => void;
}

export const useDeriverseStore = create<DeriverseState>((set) => ({
    activeTab: "Futures",
    setActiveTab: (tab) => set({ activeTab: tab }),

    executionModalOpen: false,
    openExecutionModal: () => set({ executionModalOpen: true }),
    closeExecutionModal: () => set({ executionModalOpen: false }),

    journalPage: 0,
    setJournalPage: (page) => set({ journalPage: page }),
    nextPage: () => set((state) => ({ journalPage: state.journalPage + 1 })),
    prevPage: () =>
        set((state) => ({
            journalPage: Math.max(0, state.journalPage - 1),
        })),

    isPortfolioActive: false,
    setIsPortfolioActive: (active) => set({ isPortfolioActive: active }),

    aiInsightOpen: false,
    setAiInsightOpen: (open) => set({ aiInsightOpen: open }),
}));
