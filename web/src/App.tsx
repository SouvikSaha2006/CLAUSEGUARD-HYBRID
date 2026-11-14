import React from 'react';
import { useClauseGuard } from './hooks/useClauseGuard';
import { PRESET_CONTRACTS } from './data/presets';

export function App() {
  const {
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
  } = useClauseGuard();

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPdf(file);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>ClauseGuard Hybrid (#BuildHybridAI 2026)</h1>
      <p>
        <strong>Backend & Logic Functional Test Harness</strong> (Barebones HTML for UI Swap)
      </p>

      {/* System Status Section */}
      <fieldset style={{ marginBottom: '16px' }}>
        <legend>1. Engine Status & Firebase Remote Config</legend>
        <div>
          <span>On-Device Gemini Nano: <strong>{nanoStatus.toUpperCase()}</strong> </span>
          <button type="button" onClick={() => refreshNanoStatus()} style={{ marginLeft: '8px' }}>
            Check Nano
          </button>
        </div>
        <div style={{ marginTop: '6px' }}>
          <span>Routing Mode: <strong>{remoteConfigValues.routing_mode}</strong></span> |{' '}
          <span>Escalation Threshold: <strong>{remoteConfigValues.cloud_escalation_threshold}</strong></span>
          <button type="button" onClick={() => refreshRemoteConfig()} style={{ marginLeft: '8px' }}>
            Fetch Remote Config
          </button>
        </div>
      </fieldset>

      {/* Preset Documents & PDF Ingestion */}
      <fieldset style={{ marginBottom: '16px' }}>
        <legend>2. Contract Ingestion & Realistic Test Presets</legend>
        <div style={{ marginBottom: '10px' }}>
          <strong>Load Presets: </strong>
          {PRESET_CONTRACTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset.id)}
              style={{ marginRight: '8px', marginBottom: '4px' }}
            >
              {preset.title}
            </button>
          ))}
        </div>
        <div>
          <label>
            <strong>Upload Contract PDF (Client-Side Extractor): </strong>
            <input type="file" accept=".pdf" onChange={handlePdfChange} />
          </label>
        </div>
      </fieldset>

      {/* Raw Contract Input Area */}
      <fieldset style={{ marginBottom: '16px' }}>
        <legend>3. Contract Text Input (Sensitive / Raw PII)</legend>
        <textarea
          rows={10}
          style={{ width: '100%', boxSizing: 'border-box' }}
          value={rawContractText}
          onChange={(e) => setRawContractText(e.target.value)}
          placeholder="Paste employment offer or contract with names, emails, addresses, salaries, and sensitive clauses..."
        />
        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => analyzeLocal()}
            disabled={isProcessingStage1 || !rawContractText.trim()}
          >
            {isProcessingStage1 ? 'Scanning On-Device...' : 'Run Stage 1: Local Air-Gap Redaction & Risk Scan'}
          </button>
        </div>
      </fieldset>

      {/* Error Output */}
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '16px' }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Stage 1 Results */}
      {stage1Result && (
        <fieldset style={{ marginBottom: '16px', background: '#f8f9fa' }}>
          <legend>4. Stage 1: Air-Gapped Local Output (Zero PII Leaked)</legend>
          <p>
            <strong>Risk Score:</strong> {stage1Result.riskScore} / 100 |{' '}
            <strong>PII Tokens Redacted:</strong> {stage1Result.piiRedactedCount} |{' '}
            <strong>Engine:</strong> {stage1Result.engineUsed} |{' '}
            <strong>Latency:</strong> {stage1Result.latencyMs} ms |{' '}
            <strong>Network Sent:</strong> {stage1Result.networkBytesSent} Bytes
          </p>
          <p><strong>Local Verdict:</strong> {stage1Result.localVerdict}</p>
          <div>
            <strong>Detected Risk Flags:</strong>
            <ul>
              {stage1Result.detectedFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Air-Gap Redacted Text (Safe for Cloud):</strong>
            <textarea
              rows={6}
              readOnly
              style={{ width: '100%', boxSizing: 'border-box', background: '#eee' }}
              value={stage1Result.redactedText}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={escalateToCloud}
              disabled={isProcessingStage2}
            >
              {isProcessingStage2
                ? 'Auditing in Cloud...'
                : 'Escalate to Stage 2: Cloud Deep Legal Audit (Gemini 2.5 Flash)'}
            </button>
            {stage1Result.riskScore >= remoteConfigValues.cloud_escalation_threshold && (
              <span style={{ color: 'darkorange', marginLeft: '10px' }}>
                (High risk detected: Escalation recommended by Remote Config threshold)
              </span>
            )}
          </div>
        </fieldset>
      )}

      {/* Stage 2 Results */}
      {stage2Result && (
        <fieldset style={{ marginBottom: '16px', background: '#f0f9ff' }}>
          <legend>5. Stage 2: Cloud Deep Legal Audit (Gemini 2.5 Flash)</legend>
          <p>
            <strong>Authenticity Verdict:</strong> {stage2Result.authenticityVerdict} |{' '}
            <strong>Engine:</strong> {stage2Result.engineUsed} |{' '}
            <strong>Latency:</strong> {stage2Result.latencyMs} ms
          </p>
          <div>
            <strong>Executive Summary:</strong>
            <p>{stage2Result.executiveSummary}</p>
          </div>
          <div>
            <strong>Clause Breakdown:</strong>
            <ul>
              {stage2Result.clauseBreakdown.map((item, idx) => (
                <li key={idx}>
                  <strong>[{item.riskLevel}] {item.clause}:</strong> {item.explanation}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Automated Counter-Offer / Clarification Draft:</strong>
            <textarea
              rows={6}
              readOnly
              style={{ width: '100%', boxSizing: 'border-box', background: '#fff' }}
              value={stage2Result.counterOfferEmailDraft}
            />
          </div>
        </fieldset>
      )}

      {/* Firestore Audit History */}
      <fieldset>
        <legend>6. Firestore Anonymized Audit Telemetry (Zero PII Stored)</legend>
        {history.length === 0 ? (
          <p>No audit records yet. Run a scan above to record telemetry.</p>
        ) : (
          <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Risk Score</th>
                <th>Engine</th>
                <th>Stage 2?</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {history.map((rec, idx) => (
                <tr key={rec.id || idx}>
                  <td>{new Date(rec.timestamp).toLocaleTimeString()}</td>
                  <td>{rec.riskScore} / 100</td>
                  <td>{rec.engineUsed}</td>
                  <td>{rec.stage2Completed ? 'Yes' : 'No'}</td>
                  <td>{rec.localVerdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </fieldset>
    </div>
  );
}

export default App;
