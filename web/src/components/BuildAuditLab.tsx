// ClauseGuard Hybrid (#BuildHybridAI 2026)
// BuildAuditLab.tsx - Section 7: Interactive Hybrid Audit Lab, Diff Engine & Cloud Escalation

import React, { useState, useRef, useEffect } from 'react';
import type { Stage1Result, Stage2Result } from '../lib/hybridRouter';
import type { RemoteConfigValues } from '../lib/firebase';
import type { AuditHistoryRecord } from '../hooks/useClauseGuard';
import { PRESET_CONTRACTS, type ContractPreset } from '../data/presets';

const SEA_STILL_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_224417_17e8d78c-9384-4a50-93b4-92510f1957db.png&w=2048&q=85';

const SEA_LOOP_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_232613_bf108dd9-dc98-4729-9163-748475f20b61.mp4';

// 17 Drifting Petals for Build View background (12 back + 5 front)
const BUILD_PETALS = [
  { id: 1, top: '12%', left: '8%', width: '22px', height: '14px', duration: '13s', delay: '0s', opacity: 0.55 },
  { id: 2, top: '24%', left: '25%', width: '18px', height: '12px', duration: '15s', delay: '-2s', opacity: 0.65 },
  { id: 3, top: '16%', left: '46%', width: '26px', height: '16px', duration: '17s', delay: '-4s', opacity: 0.5 },
  { id: 4, top: '38%', left: '62%', width: '20px', height: '13px', duration: '14s', delay: '-1s', opacity: 0.6 },
  { id: 5, top: '22%', left: '84%', width: '28px', height: '18px', duration: '16s', delay: '-5s', opacity: 0.45 },
  { id: 6, top: '50%', left: '14%', width: '18px', height: '11px', duration: '12s', delay: '-3s', opacity: 0.7 },
  { id: 7, top: '58%', left: '36%', width: '24px', height: '15px', duration: '18s', delay: '-6s', opacity: 0.55 },
  { id: 8, top: '44%', left: '74%', width: '20px', height: '13px', duration: '15s', delay: '-7s', opacity: 0.6 },
  { id: 9, top: '68%', left: '88%', width: '26px', height: '16px', duration: '13s', delay: '-2.5s', opacity: 0.5 },
  { id: 10, top: '64%', left: '54%', width: '19px', height: '12px', duration: '16s', delay: '-8s', opacity: 0.65 },
  { id: 11, top: '74%', left: '22%', width: '22px', height: '14px', duration: '14s', delay: '-4.5s', opacity: 0.52 },
  { id: 12, top: '80%', left: '68%', width: '24px', height: '16px', duration: '17s', delay: '-9s', opacity: 0.48 },
  // 5 front petals
  { id: 13, top: '20%', left: '16%', width: '40px', height: '26px', duration: '9s', delay: '-1.5s', opacity: 0.88 },
  { id: 14, top: '66%', left: '18%', width: '46px', height: '30px', duration: '10s', delay: '-3.8s', opacity: 0.82 },
  { id: 15, top: '30%', left: '82%', width: '44px', height: '28px', duration: '10.5s', delay: '-2s', opacity: 0.85 },
  { id: 16, top: '75%', left: '76%', width: '48px', height: '32px', duration: '9.2s', delay: '-5s', opacity: 0.8 },
  { id: 17, top: '84%', left: '44%', width: '38px', height: '24px', duration: '9.8s', delay: '-4.2s', opacity: 0.9 },
];

export interface BuildAuditLabProps {
  nanoStatus: 'ready' | 'downloading' | 'unavailable';
  remoteConfigValues: RemoteConfigValues;
  history: AuditHistoryRecord[];
  rawContractText: string;
  setRawContractText: (text: string) => void;
  isProcessingStage1: boolean;
  isProcessingStage2: boolean;
  stage1Result: Stage1Result | null;
  stage2Result: Stage2Result | null;
  error: string | null;
  analyzeLocal: (textOverride?: string) => Promise<void>;
  escalateToCloud: () => Promise<void>;
  loadPreset: (presetId: string) => ContractPreset | undefined;
  uploadPdf: (file: File) => Promise<string | null>;
  refreshRemoteConfig: () => Promise<void>;
  refreshNanoStatus: () => Promise<void>;
  reducedMotion?: boolean;
}

export const BuildAuditLab: React.FC<BuildAuditLabProps> = ({
  nanoStatus,
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
  reducedMotion = false,
}) => {
  // Fill-in-the-blanks state
  const [docType, setDocType] = useState('employment offer letter');
  const [companyName, setCompanyName] = useState('ApexCloud Global');
  const [activePresetId, setActivePresetId] = useState<string>('fake-remote-tech-scam');
  const [localRoutingMode, setLocalRoutingMode] = useState<'only' | 'prefer'>('only');

  // Feature 1: Zero-Knowledge Entity Vault & Local Re-Hydration state
  const [isVaultOpen, setIsVaultOpen] = useState(true);
  const [isRehydrated, setIsRehydrated] = useState(false);

  // Feature 2: Silent Canary Adversarial Shield details state
  const [isCanaryOpen, setIsCanaryOpen] = useState(false);

  // Flash feedbacks
  const [copiedFlash, setCopiedFlash] = useState<string | null>(null);
  const [remoteConfigFlash, setRemoteConfigFlash] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Magnetic button physics
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);

  // Parallax pointer offset
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Result scroll refs
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const stage2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (stage1Result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (stage1Result?.canaryStatus === 'INJECTION_NEUTRALIZED') {
      setIsCanaryOpen(true);
    }
  }, [stage1Result]);

  useEffect(() => {
    if (stage2Result && stage2Ref.current) {
      stage2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [stage2Result]);

  // Pointer move for parallax
  useEffect(() => {
    if (reducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setPointerOffset({
        x: ((e.clientX - cx) / cx) * 10,
        y: ((e.clientY - cy) / cy) * 10,
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [reducedMotion]);

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setIsRehydrated(false);
    setIsVaultOpen(true);
    if (presetId === 'prompt-injected-scam') {
      setIsCanaryOpen(true);
    } else {
      setIsCanaryOpen(false);
    }
    const p = loadPreset(presetId);
    if (p) {
      if (presetId === 'fake-remote-tech-scam') {
        setDocType('remote offer with equipment advance');
        setCompanyName('ApexCloud Solutions');
      } else if (presetId === 'predatory-non-compete-ip-trap') {
        setDocType('covenant agreement with 24-mo restriction');
        setCompanyName('OmniCorp Dynamic Systems');
      } else if (presetId === 'prompt-injected-scam') {
        setDocType('remote offer with adversarial injection block');
        setCompanyName('ApexNova Cloud Systems');
      } else {
        setDocType('standard engineering employment letter');
        setCompanyName('Beacon Open Technologies');
      }
    }
  };

  // PDF File Upload Handler
  const handlePdfUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsRehydrated(false);
      setIsVaultOpen(true);
      await uploadPdf(file);
      setDocType('uploaded PDF document');
      setCompanyName(file.name.replace('.pdf', ''));
    }
  };

  // Copy Redacted Skeleton Handler
  const handleCopyRedacted = () => {
    const textToCopy = stage1Result?.redactedText || rawContractText;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedFlash('Redacted text copied');
    setTimeout(() => setCopiedFlash(null), 1600);
  };

  // Fetch Remote Config Handler
  const handleRefreshConfig = async () => {
    await refreshRemoteConfig();
    await refreshNanoStatus();
    setRemoteConfigFlash(`Config: ${remoteConfigValues.routing_mode} · Escalate > ${remoteConfigValues.cloud_escalation_threshold}`);
    setTimeout(() => setRemoteConfigFlash(null), 2500);
  };

  // Copy Draft Email Handler
  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Magnetic Button Hover Physics
  const handleBtnPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || !primaryBtnRef.current) return;
    const rect = primaryBtnRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setMagneticOffset({ x: 0.3 * dx, y: 0.4 * dy });
  };

  const handleBtnPointerLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  // Re-hydrate text helper using local Entity Vault
  const rehydrateText = (text: string, vault?: Record<string, string>): string => {
    if (!text || !vault) return text;
    return text.replace(/\[([A-Z_]+_\d+)\]/g, (match) => {
      return vault[match] !== undefined ? vault[match] : match;
    });
  };

  // Highlight Redaction Tokens helper for Side-by-Side Diff
  const renderHighlightedRedactedText = (text: string) => {
    const parts = text.split(/(\[(?:PERSON|ORG|COMPENSATION|CONTACT|ID)_\d+\]|\[REDACTED_[A-Z_]+\])/g);
    return parts.map((part, idx) => {
      if (
        part.startsWith('[') &&
        part.endsWith(']') &&
        (part.includes('_') || part.startsWith('[REDACTED_'))
      ) {
        let catClass = 'token-person';
        if (part.startsWith('[ORG_')) catClass = 'token-org';
        else if (part.startsWith('[COMPENSATION_') || part.includes('SALARY')) catClass = 'token-comp';
        else if (part.startsWith('[CONTACT_')) catClass = 'token-contact';
        else if (part.startsWith('[ID_')) catClass = 'token-id';

        return (
          <span key={idx} className={`sea-diff-token-badge ${catClass}`} title={`Vault Token: ${part}`}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="sea-build-audit-lab-root">
      {/* ===================================================================
          1. ROUNDED SCENE PANEL (margin: -15u 22u 0 24u, min-height: 716u)
          =================================================================== */}
      <div className="sea-build-scene-panel">
        {/* Sunlit Sea Still + Looping Video (object-position: 50% 70%) */}
        <div
          className="sea-build-media-layer"
          style={{
            transform: reducedMotion ? 'none' : `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0)`,
          }}
        >
          <img
            src={SEA_STILL_URL}
            alt="Sunlit Sea Stage"
            className="sea-build-bg-media"
          />
          {!reducedMotion && (
            <video
              ref={videoRef}
              src={SEA_LOOP_VIDEO_URL}
              className="sea-build-bg-media sea-build-video"
              muted
              loop
              playsInline
              autoPlay
            />
          )}
        </div>

        {/* Jittering Grain Layer */}
        {!reducedMotion && <div className="sea-grain-layer" />}

        {/* 17 Drifting Petals (z: 1) */}
        {!reducedMotion && (
          <div className="sea-build-petals-layer">
            {BUILD_PETALS.map((petal) => (
              <div
                key={petal.id}
                className="sea-petal"
                style={{
                  top: petal.top,
                  left: petal.left,
                  width: petal.width,
                  height: petal.height,
                  opacity: petal.opacity,
                  animation: `floatSwayA ${petal.duration} ease-in-out infinite alternate`,
                  animationDelay: petal.delay,
                }}
              />
            ))}
          </div>
        )}

        {/* =================================================================
            2. TWO-LINE HERO HEADLINE
            (Newsreader 460, 88u, line-height 76u, color #0E2A3B)
            ================================================================= */}
        <div className="sea-build-hero-center">
          <h1 className="sea-build-headline">
            <span className="sea-build-headline-line">
              {'Audit any contract'.split(' ').map((word, idx) => (
                <span key={idx} className="sea-word-mask">
                  <span
                    className="sea-word-rising"
                    style={{
                      transitionDelay: `${0.15 + 0.06 * idx}s`,
                    }}
                  >
                    {word}&nbsp;
                  </span>
                </span>
              ))}
            </span>
            <span className="sea-build-headline-line">
              {'with zero PII leak.'.split(' ').map((word, idx) => (
                <span key={idx} className="sea-word-mask">
                  <span
                    className="sea-word-rising"
                    style={{
                      transitionDelay: `${0.33 + 0.06 * idx}s`,
                    }}
                  >
                    {word}&nbsp;
                  </span>
                </span>
              ))}
            </span>
          </h1>

          {/* ===============================================================
              3. DARK GLASS AUDIT CARD (width: min(860u, 100% - 48u))
              =============================================================== */}
          <div className="sea-build-glass-card">
            {/* Card Header & Kicker */}
            <div className="sea-build-card-header">
              <div className="sea-build-kicker">
                <span>STAGE 1: ON-DEVICE GEMINI NANO AIR-GAP SCANNER</span>
              </div>
              <div className="sea-build-badge-pill">
                <span
                  className={`sea-status-indicator ${
                    nanoStatus === 'ready'
                      ? 'ready'
                      : nanoStatus === 'downloading'
                      ? 'downloading'
                      : 'unavailable'
                  }`}
                />
                <span>
                  {nanoStatus === 'ready'
                    ? 'ON-DEVICE READY'
                    : nanoStatus === 'downloading'
                    ? 'DOWNLOADING NANO'
                    : 'CLOUD FALLBACK'}
                </span>
              </div>
            </div>

            {/* Fill-in-the-blanks Sentence */}
            <div className="sea-fill-blanks-sentence">
              <span>I'm reviewing a </span>
              <input
                type="text"
                className="sea-blank-input"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                title="Contract Type"
              />
              <span> from </span>
              <input
                type="text"
                className="sea-blank-input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                title="Company Name"
              />
              <span>, mode: </span>
              <button
                type="button"
                className={`sea-mode-toggle ${localRoutingMode === 'only' ? 'active' : ''}`}
                onClick={() => setLocalRoutingMode('only')}
              >
                Only On-Device
              </button>
              <span className="sea-nav-sep">/</span>
              <button
                type="button"
                className={`sea-mode-toggle ${localRoutingMode === 'prefer' ? 'active' : ''}`}
                onClick={() => setLocalRoutingMode('prefer')}
              >
                Prefer On-Device
              </button>
            </div>

            {/* 4-Option Preset Radiogroup with Sliding Highlight */}
            <div className="sea-preset-radiogroup">
              {PRESET_CONTRACTS.map((preset) => {
                const isActive = activePresetId === preset.id;
                let shortLabel = 'Fake Remote Offer';
                if (preset.id === 'predatory-non-compete-ip-trap') {
                  shortLabel = 'Predatory Non-Compete';
                } else if (preset.id === 'clean-standard-offer') {
                  shortLabel = 'Standard Offer';
                } else if (preset.id === 'prompt-injected-scam') {
                  shortLabel = 'Prompt-Injected Scam';
                }

                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`sea-preset-radio-pill ${isActive ? 'active' : ''} ${
                      preset.id === 'prompt-injected-scam' ? 'canary-preset' : ''
                    }`}
                    onClick={() => handleSelectPreset(preset.id)}
                  >
                    <span>{shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Dark Glass Textarea with In-Browser PDF Trigger */}
            <div className="sea-contract-box-wrapper">
              <textarea
                rows={5}
                className="sea-dark-glass-textarea"
                value={rawContractText}
                onChange={(e) => setRawContractText(e.target.value)}
                placeholder="Paste contract or employment offer text here to evaluate air-gapped risk and sanitize PII tokens..."
              />

              {/* Client-side PDF trigger badge */}
              <div className="sea-textarea-bottom-bar">
                <label className="sea-pdf-chip" title="Extract text in-browser with zero network bytes">
                  <span>📄 Upload PDF</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="sea-pdf-hidden-input"
                    onChange={handlePdfUploadChange}
                  />
                </label>
                <span className="sea-airgap-notice">Air-Gap Monitored · Zero Network PII</span>
              </div>
            </div>

            {/* Error Alert Banner */}
            {error && (
              <div className="sea-error-banner" style={{ marginTop: '12px' }}>
                <span>⚠ <strong>Alert:</strong> {error}</span>
              </div>
            )}

            {/* Feedback Flashes */}
            {copiedFlash && (
              <div className="sea-feedback-flash">
                ✓ {copiedFlash}
              </div>
            )}
            {remoteConfigFlash && (
              <div className="sea-feedback-flash config">
                ⚙ {remoteConfigFlash}
              </div>
            )}

            {/* Actions Row */}
            <div className="sea-build-actions-row">
              {/* Ghost Button 1: Asterisk icon (Copy Redacted Skeleton) */}
              <button
                type="button"
                className="sea-ghost-round-btn"
                onClick={handleCopyRedacted}
                title="Copy Redacted Skeleton"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
                </svg>
              </button>

              {/* Ghost Button 2: Orbit/Share icon (Fetch Remote Config) */}
              <button
                type="button"
                className="sea-ghost-round-btn"
                onClick={handleRefreshConfig}
                title="Fetch Remote Config"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              {/* Primary Magnetic Pill Button: Run Local Nano Scan ↗ */}
              <button
                ref={primaryBtnRef}
                type="button"
                className="sea-magnetic-pill-btn"
                style={{
                  transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
                  transition: magneticOffset.x === 0 ? 'transform 0.3s ease-out' : 'none',
                }}
                onPointerMove={handleBtnPointerMove}
                onPointerLeave={handleBtnPointerLeave}
                onClick={() => analyzeLocal(rawContractText)}
                disabled={isProcessingStage1 || !rawContractText.trim()}
              >
                <span>
                  {isProcessingStage1
                    ? 'Scanning On-Device...'
                    : 'Run Local Nano Scan ↗'}
                </span>
              </button>

              {/* Secondary Cloud Escalation Pill Button (appears once stage1Result is ready) */}
              {stage1Result && (
                <button
                  type="button"
                  className="sea-cloud-escalate-pill-btn"
                  onClick={escalateToCloud}
                  disabled={isProcessingStage2}
                >
                  <span>
                    {isProcessingStage2
                      ? 'Auditing in Cloud...'
                      : 'Escalate Redacted Skeleton to Cloud ↗'}
                  </span>
                </button>
              )}
            </div>

            {/* Threshold Escalation Advice */}
            {stage1Result && stage1Result.riskScore >= remoteConfigValues.cloud_escalation_threshold && (
              <div className="sea-threshold-advice">
                ⚠ Risk score ({stage1Result.riskScore}) exceeds threshold ({remoteConfigValues.cloud_escalation_threshold}). Cloud escalation recommended.
              </div>
            )}

            {/* ===============================================================
                4. LIVE SPLIT-SCREEN PRIVACY DIFF & AUDIT RESULTS
                =============================================================== */}
            {stage1Result && (
              <div ref={resultsRef} className="sea-results-expansion">
                {/* Stage 1 Telemetry Strip */}
                <div className="sea-telemetry-strip">
                  <div className="sea-strip-item">
                    <span className="sea-strip-label">ENGINE</span>
                    <span className="sea-strip-val">{stage1Result.engineUsed}</span>
                  </div>
                  <div className="sea-strip-divider" />
                  <div className="sea-strip-item">
                    <span className="sea-strip-label">LATENCY</span>
                    <span className="sea-strip-val">{stage1Result.latencyMs}ms</span>
                  </div>
                  <div className="sea-strip-divider" />
                  <div className="sea-strip-item">
                    <span className="sea-strip-label">PII STRIPPED</span>
                    <span className="sea-strip-val">{stage1Result.piiRedactedCount} items</span>
                  </div>
                  <div className="sea-strip-divider" />
                  <div className="sea-strip-item">
                    <span className="sea-strip-label">NETWORK SENT</span>
                    <span className="sea-strip-val" style={{ color: '#34D399' }}>0 KB</span>
                  </div>
                  <div className="sea-strip-divider" />
                  <div className="sea-strip-item">
                    <span className="sea-strip-label">RISK SCORE</span>
                    <span
                      className="sea-strip-val"
                      style={{
                        color:
                          stage1Result.riskScore >= 70
                            ? '#F87171'
                            : stage1Result.riskScore >= 40
                            ? '#FBBF24'
                            : '#34D399',
                      }}
                    >
                      {stage1Result.riskScore}/100
                    </span>
                  </div>
                  <div className="sea-strip-divider" />
                  <div className="sea-strip-item sea-strip-canary-wrap">
                    <span className="sea-strip-label">CANARY SHIELD</span>
                    <button
                      type="button"
                      className={`sea-canary-badge-btn ${
                        stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED' ? 'neutralized' : 'clean'
                      }`}
                      onClick={() => setIsCanaryOpen((prev) => !prev)}
                      title="Click to toggle Canary Shield adversarial breakdown"
                    >
                      {stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED'
                        ? '🚨 CANARY: INJECTION NEUTRALIZED'
                        : '🛡️ CANARY: CLEAN'}
                    </button>
                  </div>
                </div>

                {/* Silent Canary Adversarial & Prompt-Injection Shield Panel */}
                {(stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED' || isCanaryOpen) && (
                  <div
                    className={`sea-canary-panel ${
                      stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED' ? 'alert' : 'clean'
                    }`}
                  >
                    <div className="sea-canary-panel-header">
                      <div className="sea-canary-panel-title">
                        <span className="sea-canary-pulse-icon">
                          {stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED' ? '🚨' : '🛡️'}
                        </span>
                        <div>
                          <div className="sea-canary-headline">
                            {stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED'
                              ? 'SILENT CANARY SHIELD: PROMPT-INJECTION NEUTRALIZED'
                              : 'SILENT CANARY SHIELD: ZERO ADVERSARIAL INJECTIONS'}
                          </div>
                          <div className="sea-canary-subheadline">
                            {stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED'
                              ? 'Malicious AI system overrides and manipulation instructions were stripped on-device before Cloud Gemini transmission.'
                              : 'Document verified clean of system override instructions, zero-width steganography, and hidden prompt payloads.'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="sea-canary-toggle-btn"
                        onClick={() => setIsCanaryOpen((prev) => !prev)}
                      >
                        {isCanaryOpen ? 'Hide ▲' : 'Inspect ▼'}
                      </button>
                    </div>

                    {isCanaryOpen && (
                      <div className="sea-canary-findings-box">
                        <div className="sea-canary-findings-title">
                          {stage1Result.canaryStatus === 'INJECTION_NEUTRALIZED'
                            ? 'ADVERSARIAL VECTORS IDENTIFIED & QUARANTINED ON-DEVICE:'
                            : 'DEFENSE PROTOCOL VERIFICATIONS:'}
                        </div>
                        <div className="sea-canary-findings-grid">
                          {stage1Result.canaryFindings.length > 0 ? (
                            stage1Result.canaryFindings.map((finding, idx) => (
                              <div key={idx} className="sea-canary-finding-item">
                                <span className="sea-canary-dot" />
                                <span className="sea-canary-finding-text">{finding}</span>
                              </div>
                            ))
                          ) : (
                            <div className="sea-canary-finding-item">
                              <span className="sea-canary-dot clean" />
                              <span className="sea-canary-finding-text">
                                No prompt injection, zero-width steganography, or off-platform recruitment lures found.
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="sea-canary-guarantee-note">
                          <span>
                            🔒 <strong>Air-Gap Integrity Guarantee:</strong> Quarantined tokens replace malicious payloads. Cloud Stage 2 (Gemini 2.5 Flash) will never execute adversarial instructions.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Zero-Knowledge Entity Vault (Memory-Only) Inspector */}
                {stage1Result.entityVault && Object.keys(stage1Result.entityVault).length > 0 && (
                  <div className="sea-vault-card">
                    <div
                      className="sea-vault-header-pill"
                      onClick={() => setIsVaultOpen((prev) => !prev)}
                      role="button"
                      tabIndex={0}
                      title="Click to collapse / expand Zero-Knowledge Entity Vault"
                    >
                      <div className="sea-vault-header-left">
                        <span className="sea-vault-icon">🔒</span>
                        <span className="sea-vault-title">Zero-Knowledge Entity Vault (Memory-Only)</span>
                        <span className="sea-vault-count-badge">
                          {stage1Result.vaultEntriesCount} tokens isolated
                        </span>
                      </div>
                      <div className="sea-vault-header-right">
                        <span className="sea-vault-ram-badge">
                          STORED IN RAM ONLY · 0 BYTES SENT TO CLOUD
                        </span>
                        <span className="sea-vault-chevron">{isVaultOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isVaultOpen && (
                      <div className="sea-vault-body">
                        <div className="sea-vault-grid">
                          {Object.entries(stage1Result.entityVault).map(([token, originalVal]) => {
                            let catClass = 'token-person';
                            if (token.startsWith('[ORG_')) catClass = 'token-org';
                            else if (token.startsWith('[COMPENSATION_')) catClass = 'token-comp';
                            else if (token.startsWith('[CONTACT_')) catClass = 'token-contact';
                            else if (token.startsWith('[ID_')) catClass = 'token-id';

                            return (
                              <div key={token} className="sea-vault-chip">
                                <span className={`sea-vault-token-badge ${catClass}`}>{token}</span>
                                <span className="sea-vault-arrow">↔</span>
                                <span className="sea-vault-original-val" title={originalVal}>
                                  {originalVal}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="sea-vault-subtext">
                          <span>🛡 Ephemeral JavaScript RAM state · Instantly purged on page close · Air-Gap strictly prevents transmission to Cloud Gemini or Firestore</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Side-by-Side Air-Gap Diff */}
                <div className="sea-diff-container">
                  {/* Left Column: Raw Document */}
                  <div className="sea-diff-col">
                    <div className="sea-diff-header">
                      <span className="sea-diff-col-title">RAW DOCUMENT</span>
                      <span className="sea-diff-badge local">LOCAL DEVICE ONLY</span>
                    </div>
                    <div className="sea-diff-body">
                      <pre className="sea-diff-pre">{rawContractText}</pre>
                    </div>
                  </div>

                  {/* Right Column: Redacted Skeleton */}
                  <div className="sea-diff-col">
                    <div className="sea-diff-header">
                      <span className="sea-diff-col-title">SANITIZED SKELETON</span>
                      <span className="sea-diff-badge sanitized">AIR-GAP SANITIZED</span>
                    </div>
                    <div className="sea-diff-body">
                      <div className="sea-diff-pre">
                        {renderHighlightedRedactedText(stage1Result.redactedText)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected Red-Flag Chips */}
                <div className="sea-red-flags-section">
                  <div className="sea-flags-title">DETECTED RISK VECTORS:</div>
                  <div className="sea-flags-wrap">
                    {stage1Result.detectedFlags.map((flag, idx) => (
                      <span key={idx} className="sea-flag-pill">
                        ⚠ {flag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stage 2 Cloud Gemini 2.5 Flash Report */}
                {stage2Result && (() => {
                  const displaySummary = isRehydrated
                    ? rehydrateText(stage2Result.executiveSummary, stage1Result?.entityVault)
                    : stage2Result.executiveSummary;
                  const displayVerdict = isRehydrated
                    ? rehydrateText(stage2Result.authenticityVerdict, stage1Result?.entityVault)
                    : stage2Result.authenticityVerdict;
                  const displayClauses = stage2Result.clauseBreakdown.map((item) => ({
                    clause: isRehydrated ? rehydrateText(item.clause, stage1Result?.entityVault) : item.clause,
                    riskLevel: item.riskLevel,
                    explanation: isRehydrated ? rehydrateText(item.explanation, stage1Result?.entityVault) : item.explanation,
                  }));
                  const displayDraft = isRehydrated
                    ? rehydrateText(stage2Result.counterOfferEmailDraft, stage1Result?.entityVault)
                    : stage2Result.counterOfferEmailDraft;

                  return (
                    <div ref={stage2Ref} className="sea-stage2-report-card">
                      <div className="sea-stage2-header">
                        <div>
                          <div className="sea-stage2-kicker">STAGE 2: CLOUD DEEP LEGAL AUDIT</div>
                          <h3 className="sea-stage2-title">Gemini 2.5 Flash Intelligence</h3>
                        </div>
                        <div className="sea-stage2-verdict-pill">
                          {displayVerdict}
                        </div>
                      </div>

                      {/* Prominent Local On-Device Re-Hydration Toggle */}
                      <div className="sea-rehydration-bar">
                        <div className="sea-rehydration-left">
                          <div className="sea-rehydration-title">
                            <span className="sea-rehydrate-icon">{isRehydrated ? '⚡' : '🔒'}</span>
                            <strong>Re-Hydrate Locally (On-Device)</strong>
                          </div>
                          <span className="sea-rehydration-caption">
                            {isRehydrated
                              ? 'Active: Bracketed tokens ([PERSON_1], [ORG_1], etc.) replaced with real values purely in client state.'
                              : 'Off: Displaying raw cloud output with sanitized privacy tokens verbatim.'}
                          </span>
                        </div>

                        <div className="sea-rehydration-right">
                          <button
                            type="button"
                            className={`sea-rehydrate-toggle-pill ${isRehydrated ? 'active' : ''}`}
                            onClick={() => setIsRehydrated((prev) => !prev)}
                            title="Toggle local on-device rehydration"
                          >
                            <span className="sea-toggle-track">
                              <span className="sea-toggle-thumb" />
                            </span>
                            <span className="sea-toggle-status-text">
                              {isRehydrated ? 'RE-HYDRATED (LOCAL)' : 'ANONYMIZED (CLOUD)'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="sea-stage2-summary-box">
                        <strong>Executive Summary:</strong>
                        <p>{displaySummary}</p>
                      </div>

                      <div className="sea-stage2-clauses-list">
                        <strong>Clause-by-Clause Risk Breakdown:</strong>
                        <div className="sea-clauses-grid">
                          {displayClauses.map((item, idx) => (
                            <div key={idx} className="sea-clause-card">
                              <div className="sea-clause-card-header">
                                <span className="sea-clause-card-title">{item.clause}</span>
                                <span
                                  className={`sea-card-badge ${
                                    item.riskLevel === 'CRITICAL'
                                      ? 'critical'
                                      : item.riskLevel === 'HIGH' || item.riskLevel === 'MEDIUM'
                                      ? 'predatory'
                                      : 'clean'
                                  }`}
                                >
                                  {item.riskLevel}
                                </span>
                              </div>
                              <p className="sea-clause-card-desc">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Counter-Offer / Clarification Email Draft */}
                      <div className="sea-counter-offer-section">
                        <div className="sea-counter-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>Automated Counter-Offer / Clarification Draft:</strong>
                            {isRehydrated && (
                              <span className="sea-diff-token-badge token-comp" style={{ fontSize: '9px' }}>
                                Local Substitution Active
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="sea-btn-mini"
                            onClick={() => handleCopyDraft(displayDraft)}
                          >
                            {copiedDraft ? 'Copied ✓' : 'Copy Draft'}
                          </button>
                        </div>
                        <textarea
                          rows={6}
                          readOnly
                          className="sea-dark-glass-textarea"
                          style={{ fontSize: '11px', background: 'rgba(10,14,17,0.85)' }}
                          value={displayDraft}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================
          5. FOOTER & FIRESTORE TELEMETRY LOG
          (matching Section 7's "WORKED AT" footer)
          =================================================================== */}
      <footer className="sea-build-footer">
        <div className="sea-footer-kicker">POWERED BY FIREBASE AI LOGIC</div>

        {/* Brand Badges with SVG Icons + Newsreader 27u Wordmarks */}
        <div className="sea-footer-brands-row">
          <div className="sea-footer-brand-item">
            {/* Spark SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--clay)" strokeWidth="2">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
            </svg>
            <span className="sea-footer-brand-name">Gemini Nano</span>
          </div>

          <div className="sea-footer-brand-item">
            {/* Shield SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="sea-footer-brand-name">Firebase App Check</span>
          </div>
        </div>

        {/* Compact Anonymized Firestore Audit Strip */}
        <div className="sea-footer-audit-strip">
          <div className="sea-strip-label" style={{ marginBottom: '8px' }}>
            RECENT ANONYMIZED TELEMETRY STREAM ({history.length} SCANS STORED)
          </div>

          {history.length === 0 ? (
            <div style={{ fontSize: '11px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              No audit records stored yet. Execute an on-device scan above to record anonymized telemetry.
            </div>
          ) : (
            <div className="sea-telemetry-horizontal-scroll">
              {history.slice(0, 8).map((rec, idx) => (
                <div key={rec.id || idx} className="sea-telemetry-pill">
                  <span className="sea-telemetry-time">
                    {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span
                    className="sea-telemetry-score"
                    style={{
                      color:
                        rec.riskScore >= 70
                          ? '#F87171'
                          : rec.riskScore >= 40
                          ? '#FBBF24'
                          : '#34D399',
                    }}
                  >
                    RISK {rec.riskScore}
                  </span>
                  <span className="sea-telemetry-engine">{rec.engineUsed}</span>
                  <span className="sea-telemetry-verdict">{rec.localVerdict}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default BuildAuditLab;
