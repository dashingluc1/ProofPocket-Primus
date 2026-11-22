import { DemoResult } from '../data/verificationScenarios';

const STORAGE_KEY = 'proofpocket_v2_history';

function isValidDemoResult(item: unknown): item is DemoResult {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.proofId === 'string' &&
    typeof candidate.scenarioId === 'string' &&
    typeof candidate.title === 'string' &&
    (candidate.outcome === 'pass' || candidate.outcome === 'fail') &&
    typeof candidate.timestamp === 'string' &&
    typeof candidate.claimRule === 'string' &&
    typeof candidate.integrityHash === 'string' &&
    Array.isArray(candidate.sharedFields) &&
    Array.isArray(candidate.privateFields)
  );
}

export function loadReceiptHistory(): DemoResult[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidDemoResult);
  } catch {
    return [];
  }
}

export function saveReceiptHistory(receipts: DemoResult[]): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
    return true;
  } catch {
    return false;
  }
}

export function clearReceiptHistory(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
