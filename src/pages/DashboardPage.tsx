import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  History,
  Info,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  DemoResult,
  ScenarioId,
  VerificationScenario,
} from '../data/verificationScenarios';

interface DashboardPageProps {
  scenarios: VerificationScenario[];
  history: DemoResult[];
  onStartDemo: () => void;
  onOpenPrivacy: () => void;
  onSelectScenarioAndVerify: (scenarioId: ScenarioId) => void;
  onOpenResults: () => void;
  onReopenReceipt: (receipt: DemoResult) => void;
}

const PREVIEW_FIELDS = [
  {
    field: 'Account Status',
    fullValue: 'Active (@maya.creates)',
    proofValue: 'Verified Active Account',
    shared: true,
  },
  {
    field: 'Email Address',
    fullValue: 'maya.demo@example.org',
    proofValue: 'Hidden on device',
    shared: false,
  },
  {
    field: 'Phone Number',
    fullValue: '+234-800-000-0199',
    proofValue: 'Hidden on device',
    shared: false,
  },
  {
    field: 'Follower List & DMs',
    fullValue: '1,420 followers · 84 threads',
    proofValue: 'Hidden on device',
    shared: false,
  },
];

export default function DashboardPage({
  scenarios,
  history,
  onStartDemo,
  onOpenPrivacy,
  onSelectScenarioAndVerify,
  onOpenResults,
  onReopenReceipt,
}: DashboardPageProps) {
  const [previewMode, setPreviewMode] = useState<'proof' | 'raw'>('proof');

  const totalAttempts = history.length;
  const successfulCount = history.filter(
    (item) => item.outcome === 'pass'
  ).length;
  const unsuccessfulCount = history.filter(
    (item) => item.outcome === 'fail'
  ).length;
  const recentActivity = history.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Hero + Interactive Selective Disclosure Preview */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
        {/* Welcome Hero Card */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-[#0B162C] p-6 sm:p-8 text-white">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#C4B5FD]">
              Inspired by Primus zkTLS · Educational Prototype
            </p>
            <h1 className="mt-3 text-2xl sm:text-4xl font-bold leading-tight tracking-tight text-white">
              Prove what matters. Keep the rest private.
            </h1>
            <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
              ProofPocket demonstrates how selective disclosure lets you confirm
              specific facts about your online accounts—without handing over
              emails, IDs, or private activity logs.
            </p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onStartDemo}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#6344E5] hover:bg-[#5436D6] active:scale-[0.98] px-6 py-3 text-sm sm:text-base font-semibold text-white whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Start Demo Verification</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenPrivacy}
              className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 active:scale-[0.98] px-5 py-3 text-sm sm:text-base font-semibold text-white whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>How Privacy Works</span>
            </button>
          </div>
        </div>

        {/* Interactive Selective Disclosure Concept Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#0B162C]">
                Selective Disclosure Preview
              </h2>
              <ShieldCheck
                className="h-5 w-5 text-[#6344E5] shrink-0"
                aria-hidden="true"
              />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Switch views to compare raw profile data against a minimal proof.
            </p>

            {/* Interactive Toggle */}
            <div
              className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
              role="group"
              aria-label="Preview disclosure mode"
            >
              <button
                type="button"
                onClick={() => setPreviewMode('proof')}
                className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                  previewMode === 'proof'
                    ? 'bg-[#0B162C] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <EyeOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Minimal Proof</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('raw')}
                className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                  previewMode === 'raw'
                    ? 'bg-[#0B162C] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Full Record</span>
              </button>
            </div>

            <dl className="mt-4 divide-y divide-slate-100">
              {PREVIEW_FIELDS.map((item) => {
                const isMasked = previewMode === 'proof' && !item.shared;
                return (
                  <div
                    key={item.field}
                    className="flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm"
                  >
                    <dt className="font-medium text-slate-600">{item.field}</dt>
                    <dd
                      className={`text-right font-semibold ${
                        isMasked
                          ? 'text-slate-400'
                          : item.shared
                          ? 'text-[#5436D6]'
                          : 'text-[#0B162C]'
                      }`}
                    >
                      {previewMode === 'proof' ? item.proofValue : item.fullValue}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            {previewMode === 'proof'
              ? 'Verifier receives only 1 confirmed claim. 3 personal fields remain hidden.'
              : 'Traditional sharing exposes full personal details even for a simple check.'}
          </p>
        </div>
      </section>

      {/* Dashboard Statistics Strip */}
      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        aria-label="Verification statistics"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3
              className="h-5 w-5 text-[#6344E5] shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
              Verification Statistics
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Saved on this device
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4">
            <div className="text-[11px] sm:text-xs font-medium text-slate-500">
              Total Attempts
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-[#0B162C] tabular-nums">
              {totalAttempts}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 sm:p-4">
            <div className="text-[11px] sm:text-xs font-medium text-emerald-800">
              Successful
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
              {successfulCount}
            </div>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 sm:p-4">
            <div className="text-[11px] sm:text-xs font-medium text-rose-800">
              Unsuccessful
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-rose-700 tabular-nums">
              {unsuccessfulCount}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: 3 Demo Scenarios + Recent Activity & How It Works */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* 3 Demonstration Scenarios */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-[#0B162C]">
              Three Verification Demos
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Tap any option to test
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => onSelectScenarioAndVerify(scenario.id)}
                className="group flex w-full min-h-[64px] items-center justify-between gap-4 py-3.5 text-left transition-colors hover:bg-slate-50/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6344E5] rounded-lg px-2 -mx-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#5436D6]">
                      {scenario.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{scenario.sourcePlatform}</span>
                  </div>
                  <div className="mt-0.5 text-sm sm:text-base font-bold text-[#0B162C] group-hover:text-[#5436D6] transition-colors">
                    {scenario.title}
                  </div>
                  <p className="mt-0.5 text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {scenario.summary}
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 text-slate-400 group-hover:text-[#5436D6] shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Verification Activity + 3-Step Flow */}
        <div className="lg:col-span-5 space-y-5">
          {/* Recent Verification Activity Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <History
                  className="h-4.5 w-4.5 text-[#6344E5] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-base font-bold text-[#0B162C]">
                  Recent Verification Activity
                </h2>
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onOpenResults}
                  className="text-xs font-semibold text-[#5436D6] hover:underline whitespace-nowrap"
                >
                  View All ({history.length})
                </button>
              )}
            </div>

            {recentActivity.length > 0 ? (
              <div className="mt-3 divide-y divide-slate-100">
                {recentActivity.map((item) => (
                  <button
                    key={item.proofId}
                    type="button"
                    onClick={() => onReopenReceipt(item)}
                    className="flex w-full min-h-[54px] items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-lg text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0B162C] truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 tabular-nums">
                        <span className="font-mono text-[#5436D6]">
                          {item.proofId}
                        </span>
                        {' · '}
                        {item.timestamp}
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
                          <CheckCircle2
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
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
                ))}
              </div>
            ) : (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                No completed demos yet. Tap{' '}
                <strong className="text-[#0B162C]">
                  Start Demo Verification
                </strong>{' '}
                above to create your first saved receipt.
              </p>
            )}
          </div>

          {/* 3-Step Educational Flow */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#0B162C]">
              How Selective Verification Works
            </h2>

            <ol className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2EFFD] text-xs font-bold text-[#5436D6] tabular-nums">
                  1
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0B162C]">
                    Pick a specific claim
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Choose ownership, minimum activity, or program eligibility.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2EFFD] text-xs font-bold text-[#5436D6] tabular-nums">
                  2
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0B162C]">
                    Filter out personal details
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Sensitive emails, dates, and balances stay on your device.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2EFFD] text-xs font-bold text-[#5436D6] tabular-nums">
                  3
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#0B162C]">
                    Review & inspect a receipt
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Reopen saved receipts anytime and verify their SHA-256
                    integrity locally.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Honest Educational Disclaimer */}
      <aside className="flex items-start gap-3 rounded-2xl border border-[#DDD5FD] bg-[#F5F2FF] p-4 text-xs sm:text-sm leading-relaxed text-slate-700">
        <Info className="h-5 w-5 text-[#5436D6] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong className="text-[#0B162C]">Educational Simulation Notice:</strong>{' '}
          ProofPocket uses local fictional sample data to illustrate selective
          disclosure concepts inspired by Primus zkTLS. It never asks for
          passwords, API keys, or personal data, and does not perform actual
          zkTLS cryptography or blockchain verification.
        </p>
      </aside>
    </div>
  );
}
