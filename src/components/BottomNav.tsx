import { CheckSquare, FileCheck2, Home, Lock } from 'lucide-react';
import { TabId } from '../data/verificationScenarios';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
}

const NAV_ITEMS: {
  id: TabId;
  label: string;
  Icon: typeof Home;
}[] = [
  { id: 'dashboard', label: 'Home', Icon: Home },
  { id: 'verify', label: 'Verify', Icon: CheckSquare },
  { id: 'results', label: 'Results', Icon: FileCheck2 },
  { id: 'privacy', label: 'Privacy', Icon: Lock },
];

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 min-h-[60px] bg-white/95 backdrop-blur-md border-t border-slate-200 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 items-center px-2">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#6344E5] ${
                isActive
                  ? 'text-[#5436D6] bg-[#F2EFFD]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.3 : 1.9} aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-none tracking-tight whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
