import { useEffect, useState } from 'react';
import BottomNav from './components/BottomNav';
import TopBar from './components/TopBar';
import {
  DemoResult,
  OutcomeType,
  SIMULATION_STEPS,
  ScenarioId,
  TabId,
  VERIFICATION_SCENARIOS,
} from './data/verificationScenarios';
import DashboardPage from './pages/DashboardPage';
import PrivacyPage from './pages/PrivacyPage';
import ResultsPage from './pages/ResultsPage';
import VerifyPage from './pages/VerifyPage';
import { computeReceiptHash } from './utils/receiptCrypto';
import {
  clearReceiptHistory,
  loadReceiptHistory,
  saveReceiptHistory,
} from './utils/receiptStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>(
    VERIFICATION_SCENARIOS[0].id
  );
  const [simulateOutcome, setSimulateOutcome] = useState<OutcomeType>('pass');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const [history, setHistory] = useState<DemoResult[]>(() =>
    loadReceiptHistory()
  );
  const [latestResult, setLatestResult] = useState<DemoResult | null>(() => {
    const saved = loadReceiptHistory();
    return saved[0] ?? null;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (!isVerifying) return;

    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (verificationStep < SIMULATION_STEPS.length - 1) {
        setVerificationStep((prev) => prev + 1);
        return;
      }

      void (async () => {
        const scenario =
          VERIFICATION_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
          VERIFICATION_SCENARIOS[0];
        const profile = scenario.profiles[simulateOutcome];

        const now = new Date();
        const formattedTime = now.toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const existingIds = new Set(loadReceiptHistory().map((r) => r.proofId));
        let candidateId = `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
        while (existingIds.has(candidateId)) {
          candidateId = `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
        }

        const draftResult: DemoResult = {
          scenarioId: scenario.id,
          title: scenario.title,
          category: scenario.category,
          sourcePlatform: scenario.sourcePlatform,
          outcome: simulateOutcome,
          profileLabel: profile.label,
          claimRule: scenario.claimRule,
          claimOutput: profile.claimOutput,
          reason: profile.reason,
          sharedFields: scenario.sharedFields,
          privateFields: profile.privateFields ?? scenario.privateFields,
          proofId: candidateId,
          timestamp: formattedTime,
          createdAtIso: now.toISOString(),
          integrityHash: '',
        };

        const integrityHash = await computeReceiptHash(draftResult);
        if (cancelled) return;

        const finalizedResult: DemoResult = {
          ...draftResult,
          integrityHash,
        };

        setLatestResult(finalizedResult);
        setHistory((prev) => {
          const updated = [finalizedResult, ...prev];
          saveReceiptHistory(updated);
          return updated;
        });
        setIsVerifying(false);
        setActiveTab('results');
      })();
    }, 420);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isVerifying, verificationStep, selectedScenarioId, simulateOutcome]);

  function handleStartVerification() {
    if (isVerifying) return;
    setVerificationStep(0);
    setIsVerifying(true);
  }

  function handleSelectScenarioAndVerify(scenarioId: ScenarioId) {
    setSelectedScenarioId(scenarioId);
    setActiveTab('verify');
  }

  function handleInspectPrivacy(scenarioId: ScenarioId) {
    setSelectedScenarioId(scenarioId);
    if (latestResult && latestResult.scenarioId === scenarioId) {
      setSimulateOutcome(latestResult.outcome);
    }
    setActiveTab('privacy');
  }

  function handleReopenReceipt(receipt: DemoResult) {
    setLatestResult(receipt);
    setActiveTab('results');
  }

  function handleClearHistory() {
    clearReceiptHistory();
    setHistory([]);
    setLatestResult(null);
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#F6F7FB] text-[#0F172A]">
      <TopBar activeTab={activeTab} onChangeTab={setActiveTab} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-[calc(84px+env(safe-area-inset-bottom))] sm:px-6 sm:pt-7 md:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardPage
            scenarios={VERIFICATION_SCENARIOS}
            history={history}
            onStartDemo={() => setActiveTab('verify')}
            onOpenPrivacy={() => setActiveTab('privacy')}
            onSelectScenarioAndVerify={handleSelectScenarioAndVerify}
            onOpenResults={() => setActiveTab('results')}
            onReopenReceipt={handleReopenReceipt}
          />
        )}

        {activeTab === 'verify' && (
          <VerifyPage
            scenarios={VERIFICATION_SCENARIOS}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={setSelectedScenarioId}
            simulateOutcome={simulateOutcome}
            onChangeOutcome={setSimulateOutcome}
            isVerifying={isVerifying}
            verificationStep={verificationStep}
            onRunVerification={handleStartVerification}
          />
        )}

        {activeTab === 'results' && (
          <ResultsPage
            latestResult={latestResult}
            history={history}
            onGoToVerify={() => setActiveTab('verify')}
            onInspectPrivacy={handleInspectPrivacy}
            onSelectHistoryResult={setLatestResult}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPage
            scenarios={VERIFICATION_SCENARIOS}
            selectedScenarioId={selectedScenarioId}
            onSelectScenario={setSelectedScenarioId}
            selectedOutcome={simulateOutcome}
            onSelectOutcome={setSimulateOutcome}
            historyCount={history.length}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
