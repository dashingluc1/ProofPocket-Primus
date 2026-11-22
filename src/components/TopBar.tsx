import { ShieldCheck } from 'lucide-react';
import { TabId } from '../data/verificationScenarios';

interface TopBarProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
}

const DESKTOP_LINKS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Home' },
  { id: 'verify', label: 'Verify' },
  { id: 'results', label: 'Results' },
  { id: 'privacy', label: 'Privacy' },
];

export default function TopBar({ activeTab, onChangeTab }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-[52px] bg-[#0B162C] text-white border-b border-white/10">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => onChangeTab('dashboard')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 min-h-[44px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B73FF] rounded-lg"
          aria-label="ProofPocket Home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6344E5] text-white">
            <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-tight text-white">
            ProofPocket
          </span>
        </button>

        {/* Zone 2: Desktop single-line navigation links */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Primary Navigation"
        >
          {DESKTOP_LINKS.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onChangeTab(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B73FF] ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-[#8B73FF] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onChangeTab('verify')}
            className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#6344E5] hover:bg-[#5436D6] active:scale-[0.98] text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start Demo
          </button>
        </div>
      </div>
    </header>
  );
}
