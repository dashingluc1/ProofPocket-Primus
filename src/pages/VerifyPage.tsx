import { Check, Info, Loader2, ShieldCheck } from 'lucide-react';
import {
  OutcomeType,
  SIMULATION_STEPS,
  ScenarioId,
  VerificationScenario,
} from '../data/verificationScenarios';

interface VerifyPageProps {
  scenarios: VerificationScenario[];
  selectedScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  simulateOutcome: OutcomeType;
  onChangeOutcome: (outcome: OutcomeType) => void;
  isVerifying: boolean;
  verificationStep: number;
  onRunVerification: () => void;
}

export default function VerifyPage({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  simulateOutcome,
  onChangeOutcome,
  isVerifying,
  verificationStep,
  onRunVerification,
}: VerifyPageProps) {
  const activeScenario =
    scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const activeProfile = activeScenario.profiles[simulateOutcome];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B162C]">
          Demo Verification
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm sm:text-base text-slate-600">
          Select one of the three demonstration options, choose a sample test
          profile, and run a local verification check.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Step 1: Three Verification Options */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
            1. Choose Verification Option
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Pick the claim you want to demonstrate.
          </p>

          <div
            className="mt-4 space-y-3"
            role="radiogroup"
            aria-label="Verification options"
          >
            {scenarios.map((scenario) => {
              const isSelected = scenario.id === activeScenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isVerifying}
                  onClick={() => onSelectScenario(scenario.id)}
                  className={`w-full min-h-[72px] rounded-xl border p-4 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6344E5] disabled:opacity-60 ${
                    isSelected
                      ? 'border-[#6344E5] bg-[#F6F3FF] ring-1 ring-[#6344E5]/25'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">
                      <span className="font-semibold text-[#5436D6]">
                        {scenario.category}
                      </span>
                      {' · '}
                      {scenario.sourcePlatform}
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-[#6344E5] bg-[#6344E5] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </div>
                  <div className="mt-1.5 text-base font-bold text-[#0B162C]">
                    {scenario.title}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {scenario.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 & 3: Sample Profile + Trigger */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 2: Sample Profile Selector */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
              2. Choose Sample Test Profile
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Test both a qualifying and unsuccessful outcome without passwords
              or real personal data.
            </p>

            <div
              className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
              role="group"
              aria-label="Sample profile outcome"
            >
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => onChangeOutcome('pass')}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150 disabled:opacity-60 ${
                  simulateOutcome === 'pass'
                    ? 'bg-[#0B162C] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Meets Criteria
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={() => onChangeOutcome('fail')}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-150 disabled:opacity-60 ${
                  simulateOutcome === 'fail'
                    ? 'bg-[#0B162C] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Below Criteria
              </button>
            </div>

            <div className="mt-4 space-y-2.5 pt-4 border-t border-slate-100">
              <div className="text-sm font-bold text-[#0B162C]">
                {activeProfile.label}
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {activeProfile.sampleDisplay}
              </p>
              <div className="rounded-xl bg-[#F5F2FF] px-3.5 py-2.5 text-xs text-[#3E24A8]">
                <strong className="font-semibold">Rule checked:</strong>{' '}
                {activeScenario.claimRule}
              </div>
            </div>
          </section>

          {/* Step 3: Run Verification Action */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            {isVerifying ? (
              <div className="space-y-4" aria-live="polite">
                <div className="flex items-center gap-2.5 text-[#0B162C]">
                  <Loader2
                    className="h-5 w-5 animate-spin text-[#6344E5] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm sm:text-base font-bold">
                    Running Simulated Verification
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {SIMULATION_STEPS.map((stepText, idx) => {
                    const isDone = idx < verificationStep;
                    const isActive = idx === verificationStep;
                    return (
                      <li
                        key={stepText}
                        className={`flex items-center gap-2.5 text-xs sm:text-sm ${
                          isDone
                            ? 'text-emerald-700 font-medium'
                            : isActive
                            ? 'text-[#5436D6] font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-700'
                              : isActive
                              ? 'bg-[#EFEAFF] text-[#5436D6]'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isDone ? <Check className="h-3 w-3" /> : idx + 1}
                        </span>
                        <span>{stepText}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={onRunVerification}
                  className="min-h-[48px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#6344E5] hover:bg-[#5436D6] active:scale-[0.98] px-5 py-3 text-sm sm:text-base font-semibold text-white whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B162C]"
                >
                  <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Start Demo Verification</span>
                </button>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Runs locally with sample data only.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
