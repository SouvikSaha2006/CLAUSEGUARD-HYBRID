// ClauseGuard Hybrid - React Custom Hook for State, Routing & Persistence (#BuildHybridAI 2026)

import { useState, useEffect, useCallback } from 'react';
import {
  checkOnDeviceStatus,
  runStage1LocalAirGap,
  runStage2CloudAudit,
  type OnDeviceStatus,
  type Stage1Result,
  type Stage2Result,
  type UserPersona,
} from '../lib/hybridRouter';
import {
  fetchRemoteConfigValues,
  db,
  type RemoteConfigValues,
} from '../lib/firebase';
import { PRESET_CONTRACTS, type ContractPreset } from '../data/presets';
import { extractTextFromPdf } from '../lib/pdfExtractor';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

export interface AuditHistoryRecord {
  id?: string;
  riskScore: number;
  detectedFlags: string[];
  localVerdict: string;
  engineUsed: string;
  stage2Completed: boolean;
  authenticityVerdict?: string;
  timestamp: number;
  canaryStatus?: 'CLEAN' | 'INJECTION_NEUTRALIZED';
  userPersona?: UserPersona;
}

export function useClauseGuard() {
  const [nanoStatus, setNanoStatus] = useState<OnDeviceStatus>('unavailable');
  const [userPersona, setUserPersona] = useState<UserPersona>('grad_intern');
  const [lastRemoteConfigFetch, setLastRemoteConfigFetch] = useState<number>(() => Date.now());
  const [remoteConfigValues, setRemoteConfigValues] = useState<RemoteConfigValues>({
    routing_mode: 'hybrid_airgap',
    cloud_escalation_threshold: 60,
  });

  const [rawContractText, setRawContractText] = useState<string>('');
  const [stage1Result, setStage1Result] = useState<Stage1Result | null>(null);
  const [stage2Result, setStage2Result] = useState<Stage2Result | null>(null);

  const [isProcessingStage1, setIsProcessingStage1] = useState<boolean>(false);
  const [isProcessingStage2, setIsProcessingStage2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<AuditHistoryRecord[]>([]);

  // 1. Initial configuration load & Nano check
  const refreshRemoteConfig = useCallback(async () => {
    try {
      const cfg = await fetchRemoteConfigValues();
      setRemoteConfigValues(cfg);
      setLastRemoteConfigFetch(Date.now());
      return cfg;
    } catch (err) {
      console.warn('[ClauseGuard] Remote config fetch warning:', err);
      return null;
    }
  }, []);

  const refreshNanoStatus = useCallback(async () => {
    const status = await checkOnDeviceStatus();
    setNanoStatus(status);
  }, []);

  // 2. Fetch anonymized audit history from Firestore
  const loadHistory = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'anonymized_audit_telemetry'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const records: AuditHistoryRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        records.push({
          id: docSnap.id,
          riskScore: data.riskScore ?? 0,
          detectedFlags: data.detectedFlags ?? [],
          localVerdict: data.localVerdict ?? '',
          engineUsed: data.engineUsed ?? 'ON_DEVICE_NANO',
          stage2Completed: !!data.stage2Completed,
          authenticityVerdict: data.authenticityVerdict,
          timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
        });
      });
      if (records.length > 0) {
        setHistory(records);
      }
    } catch (err) {
      console.info('[ClauseGuard] Local memory persistence active for audit history:', err);
    }
  }, []);

  useEffect(() => {
    refreshNanoStatus();
    refreshRemoteConfig();
    loadHistory();

    const handleFocus = () => {
      refreshNanoStatus();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshNanoStatus, refreshRemoteConfig, loadHistory]);

  // 3. Persist anonymized scan metadata to Firestore (Zero PII guarantee)
  const persistAnonymizedAudit = async (
    s1: Stage1Result,
    s2?: Stage2Result | null
  ) => {
    const record: AuditHistoryRecord = {
      riskScore: s1.riskScore,
      detectedFlags: s1.detectedFlags,
      localVerdict: s1.localVerdict,
      engineUsed: s2 ? s2.engineUsed : s1.engineUsed,
      stage2Completed: !!s2,
      authenticityVerdict: s2?.authenticityVerdict,
      timestamp: Date.now(),
      canaryStatus: s1.canaryStatus,
      userPersona: s1.userPersona || userPersona,
    };

    // Update in-memory history immediately
    setHistory((prev) => [record, ...prev]);

    try {
      await addDoc(collection(db, 'anonymized_audit_telemetry'), {
        riskScore: record.riskScore,
        detectedFlags: record.detectedFlags,
        localVerdict: record.localVerdict,
        engineUsed: record.engineUsed,
        stage2Completed: record.stage2Completed,
        authenticityVerdict: record.authenticityVerdict || null,
        canaryStatus: record.canaryStatus || 'CLEAN',
        userPersona: record.userPersona || 'grad_intern',
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.info('[ClauseGuard] Anonymized audit logged to memory:', err);
    }
  };

  // 4. Run Stage 1: Local Air-Gap Redaction & Risk Score
  const analyzeLocal = useCallback(
    async (textOverride?: string, personaOverride?: UserPersona) => {
      const text = textOverride !== undefined ? textOverride : rawContractText;
      const activePersona = personaOverride || userPersona;
      if (!text || !text.trim()) {
        setError('Please enter contract text or select a preset document.');
        return;
      }

      setError(null);
      setIsProcessingStage1(true);
      setStage2Result(null);

      try {
        const forcePrefer = remoteConfigValues.routing_mode === 'hybrid_prefer_device';
        const res = await runStage1LocalAirGap(text, forcePrefer, activePersona);
        setStage1Result(res);

        // Auto-persist anonymized Stage 1 telemetry
        persistAnonymizedAudit(res, null);

        // Auto-escalate if risk score exceeds Remote Config threshold
        if (res.riskScore >= remoteConfigValues.cloud_escalation_threshold) {
          console.info(
            `[ClauseGuard] Risk score (${res.riskScore}) exceeds threshold (${remoteConfigValues.cloud_escalation_threshold}). Cloud escalation recommended.`
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`Stage 1 Air-Gap Error: ${msg}`);
      } finally {
        setIsProcessingStage1(false);
      }
    },
    [rawContractText, remoteConfigValues, userPersona]
  );

  // 5. Run Stage 2: Cloud Deep Legal Audit
  const escalateToCloud = useCallback(async () => {
    if (!stage1Result || !stage1Result.redactedText) {
      setError('Cannot escalate to Cloud: Run Stage 1 Local Air-Gap first to sanitize PII.');
      return;
    }

    setError(null);
    setIsProcessingStage2(true);

    try {
      const activePersona = stage1Result.userPersona || userPersona;
      const res = await runStage2CloudAudit(
        stage1Result.redactedText,
        stage1Result.entityVault,
        activePersona
      );
      setStage2Result(res);

      // Persist full anonymized audit telemetry (NEVER persists entityVault)
      persistAnonymizedAudit(stage1Result, res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Stage 2 Cloud Audit Error: ${msg}`);
    } finally {
      setIsProcessingStage2(false);
    }
  }, [stage1Result, userPersona]);

  // 6. Preset Loader
  const loadPreset = useCallback(
    (presetId: string): ContractPreset | undefined => {
      const found = PRESET_CONTRACTS.find((p) => p.id === presetId);
      if (found) {
        setRawContractText(found.rawText);
        setStage1Result(null);
        setStage2Result(null);
        setError(null);
      }
      return found;
    },
    []
  );

  // 7. Client-Side PDF Text Extractor
  const uploadPdf = useCallback(
    async (file: File) => {
      setError(null);
      try {
        const res = await extractTextFromPdf(file);
        const text = typeof res === 'string' ? res : res.text;
        if (!text || !text.trim()) {
          throw new Error('Extracted PDF text was empty or scanned as an image.');
        }
        setRawContractText(text);
        setStage1Result(null);
        setStage2Result(null);
        return text;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`PDF Extraction Error: ${msg}`);
        return null;
      }
    },
    []
  );

  return {
    nanoStatus,
    userPersona,
    setUserPersona,
    lastRemoteConfigFetch,
    remoteConfigValues,
    history,
    rawContractText,
    setRawContractText,
    isProcessingStage1,
    isProcessingStage2,
    stage1Result,
    stage2Result,
    error,
    analyzeLocal,
    escalateToCloud,
    loadPreset,
    uploadPdf,
    refreshRemoteConfig,
    refreshNanoStatus,
  };
}
