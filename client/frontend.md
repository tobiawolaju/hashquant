## 1. Design Philosophy: "The Pro-Consumer Terminal"
Moving away from the cluttered "Bloomberg Terminal" look, this UI adopts a **Mobile-First, Vertical-First** approach. It prioritizes psychological data (How you feel) alongside execution data (What you did).

## 2. Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion (for physics-based transitions)
- **Components:** ShadcnUI (Dialogs, Sliders, Tabs)
- **State Management:** Zustand (for high-speed UI state and view-paging)
- **Data Persistence:** Browser LocalStorage/IndexedDB (for Private Trading Journal notes)

## 3. Core Components
- **`BottomFABBar`**: A fixed, glassmorphism interaction layer containing the view-pager toggle and the "Smart" Buy/Sell buttons.
- **`VerticalScrollLayout`**: A seamless scroll experience:
    - **Fold 1:** TradingView/Chart View (Primary Execution).
    - **Fold 2:** Paginated Trading Journal (Psychology).
    - **Fold 3:** Portfolio Health Analytics (Performance).
- **`SmartBuyButton`**: Integrated VWAP (Volume Weighted Average Price) and Standard Deviation (Dispersion) visualization directly inside the button label.
- **`PsychologyPopup`**: A post-execution modal that captures Confidence (1-5), Emotional Tags, and an automated chart snapshot.

## 4. Navigation & UX
- **View-Pager:** Horizontal swiping (Futures/Perps/Options) inside the Chart fold using Framer Motion's `AnimatePresence`.
- **Haptic Locking:** The "Lock" mechanism in the trade popup prevents accidental execution and serves as the trigger for the psychological capture.

