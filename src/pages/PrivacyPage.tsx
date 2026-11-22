import { useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Share2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  OutcomeType,
  ScenarioId,
  VerificationScenario,
} from '../data/verificationScenarios';

interface PrivacyPageProps {
  scenarios: VerificationScenario[];
  selectedScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  selectedOutcome: OutcomeType;
  onSelectOutcome: (outcome: OutcomeType) => void;
  historyCount: number;
  onClearHistory: () => void;
}

export default function PrivacyPage({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  selectedOutcome,
  onSelectOutcome,
  historyCount,
  onClearHistory,
}: PrivacyPageProps) {
  const [showRawSample, setShowRawSample] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearedBanner, setClearedBanner] = useState(false);

  const activeScenario =
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const isPass = selectedOutcome === 'pass';
  const activeProfile = activeScenario.profiles[selectedOutcome];
  const activePrivateFields =
    activeProfile.privateFields ?? activeScenario.privateFields;
  const activeRawSample =
    activeProfile.rawSamplePreview ?? activeScenario.rawSamplePreview;

  function handleConfirmDelete() {
    onClearHistory();
    setConfirmClear(false);
    setClearedBanner(true);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B162C]">
          Privacy Breakdown
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm sm:text-base text-slate-600">
          Inspect exactly what minimal information is shared with a verifier
          versus what remains private on your device.
        </p>
      </section>

      {/* Scenario Filter Tabs + Outcome Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-200/70 p-1 sm:inline-flex"
          role="tablist"
          aria-label="Inspect scenario privacy"
        >
          {scenarios.map((scenario) => {
            const isActive = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectScenario(scenario.id)}
                className={`min-h-[42px] rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#0B162C] text-white'
                    : 'text-slate-700 hover:text-[#0B162C]'
                }`}
              >
                {scenario.shortLabel}
              </button>
            );
          })}
        </div>

        <div
          className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 sm:inline-grid"
          role="group"
          aria-label="Inspect outcome profile"
        >
          <button
            type="button"
            onClick={() => onSelectOutcome('pass')}
            className={`min-h-[42px] rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${
              isPass
                ? 'bg-[#0B162C] text-white'
                : 'text-slate-700 hover:text-[#0B162C]'
            }`}
          >
            Meets Criteria
          </button>
          <button
            type="button"
            onClick={() => onSelectOutcome('fail')}
            className={`min-h-[42px] rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${
              !isPass
                ? 'bg-[#0B162C] text-white'
                : 'text-slate-700 hover:text-[#0B162C]'
            }`}
          >
            Below Criteria
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison: What Is Shared vs What Remains Private */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Shared */}
        <section className="rounded-2xl border border-[#DDD5FD] bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2EFFD] text-[#5436D6]">
              <Share2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
                What Is Shared
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Minimal Yes/No or threshold claims sent to the verifier
              </p>
            </div>
          </div>

          <ul className="mt-5 divide-y divide-slate-100">
            {activeScenario.sharedFields.map((item) => (
              <li key={item.label} className="py-3.5 first:pt-0 last:pb-0">
                <div className="text-sm font-bold text-[#0B162C]">
                  {item.label}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-[#5436D6] font-medium">
                  Shared output: {isPass ? item.passValue : item.failValue}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Private */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B162C] text-white">
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
                What Remains Private
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Sensitive records filtered out and never revealed
              </p>
            </div>
          </div>

          <ul className="mt-5 divide-y divide-slate-100">
            {activePrivateFields.map((item) => (
              <li key={item.label} className="py-3.5 first:pt-0 last:pb-0">
                <div className="text-sm font-bold text-[#0B162C]">
                  {item.label}
                </div>
                <div className="mt-0.5 text-xs font-mono text-slate-500">
                  Hidden sample: {item.sampleHiddenValue}
                </div>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.whyPrivate}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Interactive Data Comparison Inspector */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="h-5 w-5 text-[#6344E5] shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
                Data Comparison Inspector
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Compare the full fictional source record with the minimal proof
              payload.
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 shrink-0"
            role="group"
            aria-label="Inspect payload format"
          >
            <button
              type="button"
              onClick={() => setShowRawSample(false)}
              className={`min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                !showRawSample
                  ? 'bg-[#0B162C] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <EyeOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Minimal Proof</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRawSample(true)}
              className={`min-h-[42px] inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                showRawSample
                  ? 'bg-[#0B162C] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Full Source</span>
            </button>
          </div>
        </div>

        <pre className="mt-4 overflow-x-auto rounded-xl bg-[#081020] p-4 text-xs leading-relaxed text-slate-200 font-mono">
          {showRawSample
            ? JSON.stringify(
                {
                  notice: 'RAW SAMPLE SOURCE DATA (Stays hidden from verifier)',
                  profile: activeProfile.label,
                  ...activeRawSample,
                },
                null,
                2
              )
            : JSON.stringify(
                {
                  notice: 'MINIMAL PROOF OUTPUT (Shared with verifier)',
                  scenario: activeScenario.title,
                  profile: activeProfile.label,
                  outcome: isPass ? 'Verified' : 'Unsuccessful',
                  claimRule: activeScenario.claimRule,
                  verifiedClaim: activeProfile.claimOutput,
                  disclosedClaims: activeScenario.sharedFields.map((field) => ({
                    label: field.label,
                    value: isPass ? field.passValue : field.failValue,
                  })),
                  personalDataIncluded: false,
                },
                null,
                2
              )}
        </pre>
      </section>

      {/* Local Data & History Controls */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
              Local Data & History Controls
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              All sample profiles are fictional. ProofPocket never collects
              passwords, API keys, or real personal information. Saved demo
              receipts are stored only in this browser&apos;s{' '}
              <code className="font-mono text-xs text-[#5436D6]">
                localStorage
              </code>
              .
            </p>
            <p className="mt-1.5 text-xs font-semibold text-[#0B162C] tabular-nums">
              Currently stored locally: {historyCount}{' '}
              {historyCount === 1 ? 'receipt' : 'receipts'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {historyCount > 0 ? (
              confirmClear ? (
                <>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap transition-colors"
                  >
                    Confirm Delete All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setClearedBanner(false);
                    setConfirmClear(true);
                  }}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-800 whitespace-nowrap transition-colors"
                >
                  <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Delete Locally Stored History</span>
                </button>
              )
            ) : (
              <span className="text-xs font-medium text-slate-500">
                No local receipts stored
              </span>
            )}
          </div>
        </div>

        {clearedBanner && historyCount === 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>Locally stored demo verification history has been deleted.</span>
          </div>
        )}
      </section>

      {/* Concept Note */}
      <aside className="flex items-start gap-3 rounded-2xl border border-[#DDD5FD] bg-[#F5F2FF] p-4 text-xs sm:text-sm leading-relaxed text-slate-700">
        <Info
          className="h-5 w-5 text-[#5436D6] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="space-y-1.5">
          <p>
            <strong className="text-[#0B162C]">How This Concept Works:</strong>{' '}
            {activeScenario.howItWorksNote}
          </p>
          <p>
            ProofPocket is an educational interface simulation—it does not
            perform actual zkTLS handshakes or blockchain verification.
          </p>
        </div>
      </aside>
    </div>
  );
}
