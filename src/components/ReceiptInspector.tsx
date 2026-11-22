import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  EyeOff,
  FileCheck2,
  Info,
  Lock,
  RotateCcw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { DemoResult, ScenarioId } from '../data/verificationScenarios';
import {
  IntegrityCheckResult,
  verifyReceiptIntegrity,
} from '../utils/receiptCrypto';

interface ReceiptInspectorProps {
  receipt: DemoResult;
  onInspectPrivacy: (scenarioId: ScenarioId) => void;
  onGoToVerify: () => void;
}

export default function ReceiptInspector({
  receipt,
  onInspectPrivacy,
  onGoToVerify,
}: ReceiptInspectorProps) {
  const [integrityResult, setIntegrityResult] =
    useState<IntegrityCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isTamperSimulated, setIsTamperSimulated] = useState(false);

  // Build the active receipt view (with optional simulated edit for testing tamper detection)
  const inspectedReceipt: DemoResult = isTamperSimulated
    ? {
        ...receipt,
        claimOutput: `${receipt.claimOutput} [Simulated Edit]`,
      }
    : receipt;

  // Reset simulated tampering and run a fresh integrity check whenever the user opens a different receipt
  useEffect(() => {
    setIsTamperSimulated(false);
    let cancelled = false;

    async function runInitialCheck() {
      setIsChecking(true);
      const res = await verifyReceiptIntegrity(receipt);
      if (!cancelled) {
        setIntegrityResult(res);
        setIsChecking(false);
      }
    }

    void runInitialCheck();

    return () => {
      cancelled = true;
    };
  }, [receipt]);

  async function handleRunIntegrityCheck(targetReceipt: DemoResult) {
    setIsChecking(true);
    const res = await verifyReceiptIntegrity(targetReceipt);
    setIntegrityResult(res);
    setIsChecking(false);
  }

  async function handleToggleTamperSimulation() {
    const nextTampered = !isTamperSimulated;
    setIsTamperSimulated(nextTampered);
    const nextReceipt: DemoResult = nextTampered
      ? {
          ...receipt,
          claimOutput: `${receipt.claimOutput} [Simulated Edit]`,
        }
      : receipt;
    await handleRunIntegrityCheck(nextReceipt);
  }

  const isPass = inspectedReceipt.outcome === 'pass';

  return (
    <div className="space-y-5">
      {/* Main Proof Inspector: Rule Evaluation + Disclosed vs Withheld */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Left: Rule Check & Receipt Metadata */}
        <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
              Proof Inspector
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Saved Receipt
            </span>
          </div>

          {/* Verification Rule + Pass/Fail Evaluation */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Verification Rule
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  isPass ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isPass ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Rule Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Rule Failed</span>
                  </>
                )}
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#0B162C]">
              {inspectedReceipt.claimRule}
            </p>
          </div>

          <dl className="mt-4 divide-y divide-slate-100">
            <div className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm">
              <dt className="text-slate-500 shrink-0">Claim Output</dt>
              <dd className="text-right font-semibold text-[#0B162C]">
                {inspectedReceipt.claimOutput}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm">
              <dt className="text-slate-500 shrink-0">Verification Type</dt>
              <dd className="text-right font-semibold text-[#0B162C]">
                {inspectedReceipt.title}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm">
              <dt className="text-slate-500 shrink-0">Data Source</dt>
              <dd className="text-right font-semibold text-[#0B162C]">
                {inspectedReceipt.sourcePlatform}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm">
              <dt className="text-slate-500 shrink-0">Profile Tested</dt>
              <dd className="text-right font-semibold text-[#0B162C]">
                {inspectedReceipt.profileLabel}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm">
              <dt className="text-slate-500 shrink-0">Receipt ID</dt>
              <dd className="text-right font-mono text-xs font-semibold text-[#5436D6] tabular-nums">
                {inspectedReceipt.proofId}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-3 text-xs sm:text-sm">
              <dt className="text-slate-500 shrink-0">Timestamp</dt>
              <dd className="text-right font-semibold text-[#0B162C] tabular-nums">
                {inspectedReceipt.timestamp}
              </dd>
            </div>
          </dl>
        </section>

        {/* Right: Disclosed vs Withheld Separation */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
              Disclosed vs. Withheld Data
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Selective Disclosure
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Information Disclosed */}
            <div className="rounded-xl border border-[#DDD5FD] bg-[#F8F6FF] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5436D6]">
                <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Information Disclosed ({inspectedReceipt.sharedFields.length})
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Minimal facts revealed to verify the rule:
              </p>
              <ul className="mt-3 divide-y divide-[#E7E1FC]">
                {inspectedReceipt.sharedFields.map((field) => (
                  <li key={field.label} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="text-xs font-semibold text-[#0B162C]">
                      {field.label}
                    </div>
                    <div className="mt-0.5 text-xs sm:text-sm font-medium text-[#5436D6]">
                      {isPass ? field.passValue : field.failValue}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information Withheld */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B162C]">
                <EyeOff className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Information Withheld ({inspectedReceipt.privateFields.length})
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Private fields kept off the receipt:
              </p>
              <ul className="mt-3 divide-y divide-slate-200/80">
                {inspectedReceipt.privateFields.map((field) => (
                  <li key={field.label} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="text-xs font-semibold text-[#0B162C]">
                      {field.label}
                    </div>
                    <div className="mt-0.5 text-[11px] font-mono text-slate-500">
                      Hidden: {field.sampleHiddenValue}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {field.whyPrivate}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onInspectPrivacy(inspectedReceipt.scenarioId)}
              className="min-h-[48px] flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6344E5] hover:bg-[#5436D6] active:scale-[0.98] px-4 py-3 text-sm font-semibold text-white whitespace-nowrap transition-all duration-150"
            >
              <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Full Privacy Breakdown</span>
            </button>
            <button
              type="button"
              onClick={onGoToVerify}
              className="min-h-[48px] flex-1 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] px-4 py-3 text-sm font-semibold text-[#0B162C] whitespace-nowrap transition-all duration-150"
            >
              Run New Verification
            </button>
          </div>
        </section>
      </div>

      {/* Receipt Integrity (Local SHA-256) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2
                className="h-5 w-5 text-[#6344E5] shrink-0"
                aria-hidden="true"
              />
              <h2 className="text-base sm:text-lg font-bold text-[#0B162C]">
                Receipt Integrity (Local SHA-256)
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Checks whether this saved receipt has been modified in browser
              storage since creation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isChecking}
              onClick={() => void handleRunIntegrityCheck(inspectedReceipt)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0B162C] hover:bg-[#152544] active:scale-[0.98] px-4 py-2 text-xs sm:text-sm font-semibold text-white whitespace-nowrap transition-all duration-150 disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{isChecking ? 'Checking...' : 'Check Integrity'}</span>
            </button>

            <button
              type="button"
              disabled={isChecking}
              onClick={() => void handleToggleTamperSimulation()}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                isTamperSimulated
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-slate-200 bg-white text-[#0B162C] hover:bg-slate-50'
              }`}
            >
              {isTamperSimulated ? (
                <>
                  <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Revert Simulated Edit</span>
                </>
              ) : (
                <>
                  <AlertTriangle
                    className="h-4 w-4 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                  <span>Simulate Receipt Edit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {integrityResult && (
          <div className="mt-4 space-y-3">
            <div
              className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                integrityResult.valid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                  : 'border-rose-200 bg-rose-50 text-rose-950'
              }`}
            >
              {integrityResult.valid ? (
                <ShieldCheck
                  className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <ShieldAlert
                  className="h-5 w-5 text-rose-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0 text-xs sm:text-sm">
                <div className="font-bold">
                  {integrityResult.valid
                    ? 'Integrity Intact — Receipt Unmodified'
                    : 'Modification Detected — SHA-256 Mismatch'}
                </div>
                <p className="mt-0.5 opacity-90">
                  {integrityResult.valid
                    ? `The recomputed SHA-256 hash matches the stored receipt digest (checked at ${integrityResult.checkedAt}).`
                    : `The current receipt payload no longer matches its original SHA-256 digest (checked at ${integrityResult.checkedAt}).`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="text-[11px] font-semibold text-slate-500">
                  Stored Receipt SHA-256
                </div>
                <div className="mt-1 break-all font-mono text-xs text-[#0B162C]">
                  {integrityResult.storedHash || 'Missing hash'}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="text-[11px] font-semibold text-slate-500">
                  Recomputed SHA-256
                </div>
                <div
                  className={`mt-1 break-all font-mono text-xs ${
                    integrityResult.valid
                      ? 'text-emerald-700'
                      : 'text-rose-700 font-semibold'
                  }`}
                >
                  {integrityResult.computedHash}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#F5F2FF] p-3.5 text-xs leading-relaxed text-slate-700">
          <Info
            className="h-4 w-4 text-[#5436D6] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p>
            <strong className="text-[#0B162C]">Local Integrity Only:</strong>{' '}
            This SHA-256 hash only checks whether the saved demo receipt was
            altered locally on your device. It is <strong>not</strong> a Primus
            cryptographic attestation, zkTLS proof, or blockchain signature.
          </p>
        </div>
      </section>
    </div>
  );
}
