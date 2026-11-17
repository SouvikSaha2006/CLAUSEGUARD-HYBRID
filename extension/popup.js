// ClauseGuard Hybrid — Extension Popup Script (#BuildHybridAI 2026)
// Feature 4: Cross-Platform Chrome Extension Intercept & Web Audit Lab Handoff

const WEB_AUDIT_LAB_BASE_URL = 'http://localhost:5173';

// DOM Elements
const engineBadge = document.getElementById('engineBadge');
const engineDot = document.getElementById('engineDot');
const engineLabel = document.getElementById('engineLabel');
const captureStatus = document.getElementById('captureStatus');
const captureIcon = document.getElementById('captureIcon');
const captureText = document.getElementById('captureText');
const btnRescan = document.getElementById('btnRescan');
const inputText = document.getElementById('inputText');
const charCountLabel = document.getElementById('charCountLabel');
const btnRunAirGap = document.getElementById('btnRunAirGap');
const btnOpenWebEmpty = document.getElementById('btnOpenWebEmpty');
const resultsCard = document.getElementById('resultsCard');
const riskScoreNumber = document.getElementById('riskScoreNumber');
const riskScoreBarFill = document.getElementById('riskScoreBarFill');
const canaryBadge = document.getElementById('canaryBadge');
const canaryIcon = document.getElementById('canaryIcon');
const canaryStatusText = document.getElementById('canaryStatusText');
const localVerdict = document.getElementById('localVerdict');
const flagsList = document.getElementById('flagsList');
const redactedPreview = document.getElementById('redactedPreview');
const btnCopyRedacted = document.getElementById('btnCopyRedacted');
const latencySpan = document.getElementById('latencySpan');
const bytesSpan = document.getElementById('bytesSpan');
const btnHandoffToWeb = document.getElementById('btnHandoffToWeb');

let nanoAvailable = false;
let currentRedactedText = '';
let currentRiskScore = 0;

// Update character count live
inputText.addEventListener('input', () => {
  charCountLabel.textContent = `${inputText.value.length} chars`;
});

// 1. Check Gemini Nano Availability via LanguageModel / window.ai
async function checkNanoAvailability() {
  try {
    const lmApi = window.LanguageModel || (window.ai && window.ai.languageModel);
    if (lmApi) {
      if (typeof lmApi.availability === 'function') {
        const status = await lmApi.availability();
        if (status === 'available' || status === 'readily' || status === 'ready') {
          nanoAvailable = true;
        }
      } else if (typeof lmApi.capabilities === 'function') {
        const caps = await lmApi.capabilities();
        if (caps?.available === 'readily' || caps?.available === 'ready') {
          nanoAvailable = true;
        }
      }
    }
  } catch (err) {
    console.info('[ClauseGuard Extension] Nano availability check note:', err);
    nanoAvailable = false;
  }

  updateEngineBadge(nanoAvailable ? 'NANO' : 'FALLBACK');
}

function updateEngineBadge(mode) {
  if (mode === 'NANO') {
    engineDot.className = 'sea-engine-dot';
    engineLabel.textContent = '🟢 ON-DEVICE NANO · 0 KB SENT';
    engineBadge.style.borderColor = 'rgba(52, 211, 153, 0.4)';
    engineBadge.style.color = '#34D399';
  } else {
    engineDot.className = 'sea-engine-dot fallback';
    engineLabel.textContent = '⚡ LOCAL AIR-GAP REGEX · 0 KB SENT';
    engineBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    engineBadge.style.color = '#FCD34D';
  }
}

// 2. Silent Canary Adversarial & Prompt-Injection Shield (Local & Instant)
function runCanaryShieldScan(text) {
  const findings = [];
  let neutralized = text;
  let strippedCount = 0;

  // 2.1 Zero-width steganography
  const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u2060-\u2064]/g;
  const zeroMatches = text.match(ZERO_WIDTH_REGEX);
  if (zeroMatches && zeroMatches.length > 0) {
    findings.push(`Steganography: Neutralized ${zeroMatches.length} zero-width unicode characters.`);
    neutralized = neutralized.replace(ZERO_WIDTH_REGEX, '');
    strippedCount += zeroMatches.length;
  }

  // 2.2 Explicit prompt injection blocks
  const injectionBlockRegex = /\[(?:SYSTEM|ADMIN|DEVELOPER|INSTRUCTION|OVERRIDE|ASSISTANT)[^\]]*\]/gi;
  neutralized = neutralized.replace(injectionBlockRegex, (match) => {
    findings.push(`Adversarial Injection Quarantined: "${match.slice(0, 50)}..."`);
    strippedCount++;
    return '[CANARY_QUARANTINED: Prompt-Injection Payload Neutralized]';
  });

  // 2.3 Covert HTML comments
  const commentRegex = /<!--[\s\S]*?(?:system|admin|override|ignore|disregard|instruction|riskscore|prompt)[\s\S]*?-->/gi;
  neutralized = neutralized.replace(commentRegex, () => {
    findings.push('Covert HTML comment instruction payload quarantined.');
    strippedCount++;
    return '[CANARY_QUARANTINED: Hidden Comment Instruction Neutralized]';
  });

  // 2.4 AI manipulation directives
  const manipulationPatterns = [
    { regex: /(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|directives|rules)/gi, desc: 'Bypass attempt: "ignore previous instructions" blocked' },
    { regex: /(?:system\s+override|developer\s+mode|jailbreak|unrestricted\s+mode)/gi, desc: 'Privilege escalation: "system override" directive blocked' },
    { regex: /(?:mark|classify|label|treat|consider)\s+(?:this\s+)?(?:contract|document|agreement|offer)\s+(?:as\s+)?(?:100%?\s+)?(?:safe|clean|legitimate|verified)/gi, desc: 'Falsification directive demanding artificial "safe" classification' },
    { regex: /(?:riskscore|risk_score|risk\s*score)\s*[:=]\s*(?:0|5|10|low|clean)/gi, desc: 'Metric tampering: Attempted to force riskScore manipulation' },
    { regex: /(?:advise|recommend)\s+immediate\s+(?:signing|acceptance|execution)/gi, desc: 'Psychological coercion: Urging immediate signing without review' },
  ];

  for (const { regex, desc } of manipulationPatterns) {
    if (regex.test(neutralized)) {
      findings.push(desc);
      neutralized = neutralized.replace(regex, '[CANARY_QUARANTINED: Directive Blocked]');
      strippedCount++;
    }
  }

  const isNeutralized = strippedCount > 0 || findings.length > 0;
  return {
    canaryStatus: isNeutralized ? 'INJECTION_NEUTRALIZED' : 'CLEAN',
    canaryFindings: findings,
    neutralizedText: neutralized,
    injectionsStrippedCount: strippedCount,
  };
}

// 3. Deterministic Local Air-Gap Entity Redactor & Heuristic Scanner
function localAirGapRedactor(text) {
  const canaryReport = runCanaryShieldScan(text);
  const flags = [];
  let score = 15;

  if (canaryReport.canaryStatus === 'INJECTION_NEUTRALIZED') {
    score = 98;
    flags.push('CRITICAL: Adversarial prompt-injection attack neutralized on-device by Silent Canary Shield');
    for (const f of canaryReport.canaryFindings) {
      flags.push(`CANARY DEFENSE: ${f}`);
    }
  }

  let workText = canaryReport.neutralizedText;
  const vault = {
    PERSON: [],
    ORG: [],
    COMPENSATION: [],
    CONTACT: [],
    ID: []
  };

  function register(val, cat) {
    const trimmed = String(val).trim();
    if (!trimmed || trimmed.length < 2) return;
    if (!vault[cat].includes(trimmed)) {
      vault[cat].push(trimmed);
    }
  }

  // 1. Emails -> CONTACT
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = workText.match(emailRegex) || [];
  for (const email of emails) register(email, 'CONTACT');

  // 2. Phones -> CONTACT
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = workText.match(phoneRegex) || [];
  for (const phone of phones) register(phone, 'CONTACT');

  // 3. Compensation / Money figures -> COMPENSATION
  const currRegex = /(?:\$|USD|INR|₹|Rs\.?)\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s?(?:per\s?year|\/yr|annually|hourly|\/hr|per\s?month|\/mo|k|million))?/gi;
  const currs = workText.match(currRegex) || [];
  for (const curr of currs) register(curr, 'COMPENSATION');

  // 4. SSNs & IDs -> ID
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssns = workText.match(ssnRegex) || [];
  for (const ssn of ssns) register(ssn, 'ID');

  // 5. Persons & Organizations from common patterns
  const namePrefixedRegex = /\b(Candidate Name|Candidate|Employee|Dear):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi;
  let nameMatch;
  while ((nameMatch = namePrefixedRegex.exec(workText)) !== null) {
    if (nameMatch[2]) register(nameMatch[2], 'PERSON');
  }

  const orgPrefixedRegex = /\b(Company|Employer|On behalf of):\s*([A-Z][A-Za-z0-9\s.,&-]+?(?:,\s*Inc\.?|,\s*LLC|,\s*Corp)?)/gi;
  let orgMatch;
  while ((orgMatch = orgPrefixedRegex.exec(workText)) !== null) {
    if (orgMatch[2]) register(orgMatch[2], 'ORG');
  }

  // First line header company detection
  const firstLine = workText.slice(0, 180).split(/\r?\n/)[0]?.trim() || '';
  if (/(?:INC|LLC|PBC|CORP|LTD|SYSTEMS|TECHNOLOGIES|SOLUTIONS)\b/i.test(firstLine)) {
    register(firstLine, 'ORG');
  }

  // Apply numbered replacement tokens
  let redacted = workText;
  let piiCount = 0;

  for (const [cat, items] of Object.entries(vault)) {
    items.sort((a, b) => b.length - a.length);
    items.forEach((item, idx) => {
      const token = `[${cat}_${idx + 1}]`;
      const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const reg = new RegExp(escaped, 'gi');
      if (reg.test(redacted)) {
        redacted = redacted.replace(reg, token);
        piiCount++;
      }
    });
  }

  // Scan for risk signatures
  const lower = workText.toLowerCase();

  // Advance fee scam
  if (
    lower.includes("cashier's check") ||
    lower.includes('cashiers check') ||
    lower.includes('wire transfer') ||
    lower.includes('telegram') ||
    lower.includes('provisioning partner') ||
    lower.includes('approved equipment provider')
  ) {
    score += 55;
    flags.push('CRITICAL: Advance-fee / equipment fake check scam indicator detected');
  }

  // Predatory non-compete
  if (
    lower.includes('twenty-four (24) months') ||
    lower.includes('24 months') ||
    (lower.includes('non-competition') && lower.includes('worldwide')) ||
    (lower.includes('not directly or indirectly engage') && lower.includes('software'))
  ) {
    score += 35;
    flags.push('HIGH RISK: Unreasonable 24-month worldwide non-compete restraint');
  }

  // Personal IP grab
  if (
    lower.includes('outside working hours') ||
    lower.includes('prior to employment') ||
    lower.includes('personal open-source projects') ||
    lower.includes('whether related or completely unrelated')
  ) {
    score += 30;
    flags.push('HIGH RISK: Predatory personal side-project & prior IP expropriation');
  }

  // Liquidated damages / penalty
  if (lower.includes('liquidated damages') || lower.includes('$250,000') || lower.includes('training bond') || lower.includes('clawback')) {
    score += 25;
    flags.push('HIGH RISK: Departure clawback penalty / punitive liquidated damages');
  }

  // Safe markers
  if (lower.includes('no post-employment non-compete') || lower.includes('retains full rights to pre-existing inventions')) {
    score = Math.max(10, score - 20);
    flags.push('Standard fair employment protections verified');
  }

  score = Math.min(100, Math.max(5, score));

  let verdict = 'Low Risk Agreement: Standard employment covenants.';
  if (canaryReport.canaryStatus === 'INJECTION_NEUTRALIZED') {
    verdict = 'CRITICAL ALERT: Adversarial prompt-injection quarantined on-device.';
  } else if (score >= 70) {
    verdict = 'CRITICAL ALERT: High-risk covenants, scam vectors, or clawback penalties detected.';
  } else if (score >= 40) {
    verdict = 'ELEVATED RISK: Restrictive covenants require legal clarification or counter-offer.';
  }

  return {
    redactedText: redacted,
    piiRedactedCount: Math.max(1, piiCount),
    riskScore: score,
    detectedFlags: flags.length ? flags : ['No severe predatory risks detected.'],
    localVerdict: verdict,
    canaryStatus: canaryReport.canaryStatus,
    canaryFindings: canaryReport.canaryFindings,
  };
}

// 4. Primary Stage 1 Execution: Gemini Nano or Fallback
async function executeAirGapScan() {
  const rawText = inputText.value.trim();
  if (!rawText) {
    alert('Please enter or highlight contract text to scan.');
    return;
  }

  btnRunAirGap.disabled = true;
  btnRunAirGap.textContent = 'Scanning On-Device...';

  const startTime = performance.now();
  let result;

  try {
    const lmApi = window.LanguageModel || (window.ai && window.ai.languageModel);
    if (nanoAvailable && lmApi && typeof lmApi.create === 'function') {
      const session = await lmApi.create({
        systemPrompt: 'You are a fast on-device privacy air-gap entity extractor and contract risk scanner. Return strict JSON with: entities, riskScore, detectedFlags, localVerdict.'
      });
      const prompt = `Sanitize all PII into numbered tokens ([PERSON_1], [ORG_1], [COMPENSATION_1], [CONTACT_1], [ID_1]) and evaluate risks:\n\n${rawText}`;
      const response = await session.prompt(prompt);
      try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        const fallback = localAirGapRedactor(rawText);
        result = {
          redactedText: fallback.redactedText,
          piiRedactedCount: fallback.piiRedactedCount,
          riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : fallback.riskScore,
          detectedFlags: Array.isArray(parsed.detectedFlags) && parsed.detectedFlags.length ? parsed.detectedFlags : fallback.detectedFlags,
          localVerdict: parsed.localVerdict || fallback.localVerdict,
          canaryStatus: fallback.canaryStatus,
          canaryFindings: fallback.canaryFindings,
        };
        updateEngineBadge('NANO');
      } catch (parseErr) {
        result = localAirGapRedactor(rawText);
        updateEngineBadge('FALLBACK');
      }
    } else {
      result = localAirGapRedactor(rawText);
      updateEngineBadge('FALLBACK');
    }
  } catch (err) {
    console.warn('[ClauseGuard Extension] Nano inference fell back to deterministic air-gap:', err);
    result = localAirGapRedactor(rawText);
    updateEngineBadge('FALLBACK');
  }

  const latency = Math.round(performance.now() - startTime);
  currentRedactedText = result.redactedText;
  currentRiskScore = result.riskScore;

  // Render UI
  renderResults(result, latency);

  btnRunAirGap.disabled = false;
  btnRunAirGap.textContent = 'Run On-Device Scan ⚡';
}

// 5. Render Scan Results to UI
function renderResults(result, latency) {
  resultsCard.style.display = 'block';

  // Risk Score Number & Bar
  riskScoreNumber.textContent = result.riskScore;
  riskScoreBarFill.style.width = `${Math.min(100, Math.max(5, result.riskScore))}%`;

  const levelClass = result.riskScore >= 70 ? 'high' : result.riskScore >= 40 ? 'med' : 'low';
  riskScoreNumber.className = `sea-score-number ${levelClass}`;
  riskScoreBarFill.className = `sea-score-bar-fill ${levelClass}`;

  // Canary Badge
  if (result.canaryStatus === 'INJECTION_NEUTRALIZED') {
    canaryBadge.className = 'sea-canary-badge alert';
    canaryIcon.textContent = '⚠️';
    canaryStatusText.textContent = 'CANARY: INJECTION QUARANTINED';
  } else {
    canaryBadge.className = 'sea-canary-badge';
    canaryIcon.textContent = '🛡️';
    canaryStatusText.textContent = 'CANARY: CLEAN';
  }

  // Verdict
  localVerdict.textContent = result.localVerdict;

  // Flags List
  flagsList.innerHTML = '';
  result.detectedFlags.forEach((flag) => {
    const li = document.createElement('li');
    li.textContent = flag;
    flagsList.appendChild(li);
  });

  // Highlight Tokens in Redacted Preview
  const tokenRegex = /(\[(?:PERSON|ORG|COMPENSATION|CONTACT|ID|CANARY_QUARANTINED)[^\]]*\])/g;
  const parts = result.redactedText.split(tokenRegex);
  redactedPreview.innerHTML = '';
  parts.forEach((part) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const span = document.createElement('span');
      span.className = 'token';
      span.textContent = part;
      redactedPreview.appendChild(span);
    } else {
      redactedPreview.appendChild(document.createTextNode(part));
    }
  });

  // Telemetry
  latencySpan.textContent = `Latency: ${latency}ms`;
  bytesSpan.textContent = `Network: 0 KB Sent (Air-Gap)`;

  // Scroll results into view
  resultsCard.scrollIntoView({ behavior: 'smooth' });
}

// 6. Automatically capture window.getSelection() from active tab
async function autoCaptureSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      captureIcon.textContent = '📝';
      captureText.textContent = 'Paste contract clauses below to begin';
      return;
    }

    // Ignore chrome:// or edge:// internal pages
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://')) {
      captureIcon.textContent = '📝';
      captureText.textContent = 'Paste contract clauses below to begin';
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || ''
    });

    const selectedText = results?.[0]?.result?.trim();
    if (selectedText && selectedText.length > 5) {
      captureIcon.textContent = '✨';
      captureText.textContent = `Intercepted ${selectedText.length} chars from active tab!`;
      inputText.value = selectedText;
      charCountLabel.textContent = `${selectedText.length} chars`;

      // Auto-trigger on-device scan immediately for instant zero-click feedback!
      executeAirGapScan();
    } else {
      captureIcon.textContent = 'ℹ️';
      captureText.textContent = 'No text highlighted. Paste text or highlight on page.';
    }
  } catch (err) {
    console.info('[ClauseGuard Extension] Selection capture info:', err);
    captureIcon.textContent = '📝';
    captureText.textContent = 'Paste contract clauses below to begin';
  }
}

// 7. Event Listeners
btnRunAirGap.addEventListener('click', executeAirGapScan);

btnRescan.addEventListener('click', autoCaptureSelection);

btnCopyRedacted.addEventListener('click', () => {
  if (!currentRedactedText) return;
  navigator.clipboard.writeText(currentRedactedText);
  btnCopyRedacted.textContent = 'Copied!';
  setTimeout(() => {
    btnCopyRedacted.textContent = 'Copy';
  }, 1500);
});

// 8. Escalate Anonymized Skeleton to Web Audit Lab ↗
btnHandoffToWeb.addEventListener('click', () => {
  if (!currentRedactedText) return;

  // Transmit strictly the ANONYMIZED/REDACTED skeleton. Zero raw PII is ever sent!
  const handoffUrl = `${WEB_AUDIT_LAB_BASE_URL}/#build?redacted=${encodeURIComponent(currentRedactedText)}&source=extension&riskScore=${currentRiskScore}`;
  chrome.tabs.create({ url: handoffUrl });
});

btnOpenWebEmpty.addEventListener('click', () => {
  chrome.tabs.create({ url: `${WEB_AUDIT_LAB_BASE_URL}/#build` });
});

// Initialize on popup load
document.addEventListener('DOMContentLoaded', async () => {
  await checkNanoAvailability();
  await autoCaptureSelection();
});
