import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  History,
  Lock,
  Trash2,
  XCircle,
} from 'lucide-react';
import ReceiptInspector from '../components/ReceiptInspector';
import { DemoResult, ScenarioId } from '../data/verificationScenarios';

interface ResultsPageProps {
  latestResult: DemoResult | null;
  history: DemoResult[];
  onGoToVerify: () => void;
  onInspectPrivacy: (scenarioId: ScenarioId) => void;
  onSelectHistoryResult: (result: DemoResult) => void;
  onClearHistory: () => void;
}

type HistoryFilter = 'all' | 'pass' | 'fail';

export default function ResultsPage({
  latestResult,
  history,
  onGoToVerify,
  onInspectPrivacy,
  onSelectHistoryResult,
  onClearHistory,
}: ResultsPageProps) {
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!latestResult && history.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2EFFD] text-[#5436D6]">
            <Lock className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-xl sm:text-2xl font-bold text-[#0B162C]">
            No Demo Results Yet
          </h1>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
            Run one of the three verification demos to generate a saved receipt,
            inspect disclosed vs. withheld fields, and verify its local SHA-256
            integrity.
          </p>
          <button
            type="button"
            onClick={onGoToVerify}
            className="mt-6 min-h-[48px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#6344E5] hover:bg-[#5436D6] active:scale-[0.98] px-6 py-3 text-sm sm:text-base font-semibold text-white whitespace-nowrap transition-all duration-150"
          >
            <span>Go to Demo Verification</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </section>
      </div>
    );
  }

  const activeReceipt = latestResult || history[0];
  const isPass = activeReceipt.outcome === 'pass';

  const passCount = history.filter((item) => item.outcome === 'pass').length;
  const failCount = history.filter((item) => item.outcome === 'fail').length;
  const filteredHistory = history.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.outcome === historyFilter;
  });

  function handleSelectReceipt(item: DemoResult) {
    onSelectHistoryResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-6">
      {/* Status Banner for Active / Reopened Receipt */}
      <section
        className={`flex items-start gap-4 rounded-2xl border p-5 sm:p-6 ${
          isPass
            ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
            : 'border-rose-200 bg-rose-50 text-rose-950'
        }`}
      >
        {isPass ? (
          <CheckCircle2
            className="h-7 w-7 text-emerald-700 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ) : (
          <XCircle
            className="h-7 w-7 text-rose-700 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wide">
            {isPass ? 'Verified Demo Result' : 'Unsuccessful Demo Result'}
            {' · '}
            <span className="font-mono tabular-nums">
              {activeReceipt.proofId}
            </span>
          </p>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold">
            {activeReceipt.title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base leading-relaxed opacity-90">
            {activeReceipt.reason}
          </p>
        </div>
      </section>

      {/* Proof Inspector + SHA-256 Receipt Integrity */}
      <ReceiptInspector
        receipt={activeReceipt}
        onInspectPrivacy={onInspectPrivacy}
        onGoToVerify={onGoToVerify}
      />

      {/* Full Verification History (Persisted in localStorage) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <History
                className="h-5 w-5 text-[#6344E5] shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
                Verification History
              </h2>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 tabular-nums">
              {history.length} saved{' '}
              {history.length === 1 ? 'receipt' : 'receipts'} stored locally.
              Tap any session to reopen it in the Proof Inspector.
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              {confirmClear ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="min-h-[42px] rounded-xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors"
                  >
                    Confirm Delete All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="min-h-[42px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 whitespace-nowrap transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 px-3.5 py-2 text-xs font-semibold text-slate-700 whitespace-nowrap transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Delete History</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <div
          className="mt-4 flex items-center gap-1 rounded-xl bg-slate-100 p-1 sm:inline-flex"
          role="group"
          aria-label="Filter saved receipts"
        >
          <button
            type="button"
            onClick={() => setHistoryFilter('all')}
            className={`min-h-[40px] flex-1 sm:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap tabular-nums transition-colors ${
              historyFilter === 'all'
                ? 'bg-[#0B162C] text-white'
                : 'text-slate-600 hover:text-[#0B162C]'
            }`}
          >
            All ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setHistoryFilter('pass')}
            className={`min-h-[40px] flex-1 sm:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap tabular-nums transition-colors ${
              historyFilter === 'pass'
                ? 'bg-[#0B162C] text-white'
                : 'text-slate-600 hover:text-[#0B162C]'
            }`}
          >
            Verified ({passCount})
          </button>
          <button
            type="button"
            onClick={() => setHistoryFilter('fail')}
            className={`min-h-[40px] flex-1 sm:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap tabular-nums transition-colors ${
              historyFilter === 'fail'
                ? 'bg-[#0B162C] text-white'
                : 'text-slate-600 hover:text-[#0B162C]'
            }`}
          >
            Unsuccessful ({failCount})
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="mt-4 py-4 text-sm text-slate-500">
            No saved receipts match this filter.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {filteredHistory.map((item) => {
              const isSelected = item.proofId === activeReceipt.proofId;
              return (
                <button
                  key={item.proofId}
                  type="button"
                  onClick={() => handleSelectReceipt(item)}
                  className={`flex w-full min-h-[60px] items-center justify-between gap-4 py-3.5 px-3 -mx-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-[#F5F2FF] ring-1 ring-[#DDD5FD]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0B162C] truncate">
                        {item.title}
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-semibold text-[#5436D6] whitespace-nowrap">
                          Inspecting
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 tabular-nums">
                      <span className="font-mono text-[#5436D6]">
                        {item.proofId}
                      </span>
                      {' · '}
                      {item.timestamp}
                      {' · '}
                      {item.profileLabel}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold shrink-0 ${
                      item.outcome === 'pass'
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {item.outcome === 'pass' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" aria-hidden="true" />
                        <span>Unsuccessful</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
