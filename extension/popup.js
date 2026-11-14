// ClauseGuard Hybrid - Extension Popup Script (#BuildHybridAI)

const nanoStatusEl = document.getElementById('nanoStatus');
const btnGrabSelection = document.getElementById('btnGrabSelection');
const inputText = document.getElementById('inputText');
const btnRunAirGap = document.getElementById('btnRunAirGap');
const btnOpenWeb = document.getElementById('btnOpenWeb');
const resultsCard = document.getElementById('resultsCard');
const riskBadge = document.getElementById('riskBadge');
const localVerdict = document.getElementById('localVerdict');
const flagsList = document.getElementById('flagsList');
const redactedPreview = document.getElementById('redactedPreview');
const latencySpan = document.getElementById('latencySpan');
const bytesSpan = document.getElementById('bytesSpan');

let nanoAvailable = false;

// 1. Check Gemini Nano Availability
async function checkNano() {
  try {
    const aiApi = window.ai || (window).LanguageModel;
    if (aiApi && (aiApi.languageModel || typeof aiApi.create === 'function')) {
      const lm = aiApi.languageModel || aiApi;
      const capabilities = await lm.capabilities?.();
      if (capabilities?.available === 'readily' || capabilities?.available === 'ready') {
        nanoAvailable = true;
        nanoStatusEl.textContent = 'Nano: Ready';
        nanoStatusEl.className = 'status-badge ready';
        return;
      } else if (capabilities?.available === 'after-download') {
        nanoStatusEl.textContent = 'Nano: Downloading';
        nanoStatusEl.className = 'status-badge unavailable';
        return;
      }
    }
    nanoStatusEl.textContent = 'Nano: Emulated/Fallback';
    nanoStatusEl.className = 'status-badge unavailable';
  } catch (err) {
    nanoStatusEl.textContent = 'Nano: Unavailable';
    nanoStatusEl.className = 'status-badge unavailable';
  }
}

// 2. Grab highlighted text from active tab
btnGrabSelection.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || ''
    });

    const selectedText = results?.[0]?.result;
    if (selectedText && selectedText.trim()) {
      inputText.value = selectedText.trim();
    } else {
      alert('No text selected on current page. Please highlight text on any page first or paste text below.');
    }
  } catch (err) {
    console.error('Failed to grab selection:', err);
    alert('Unable to extract text from this tab: ' + err.message);
  }
});

// 3. Local PII Redactor and Risk Analysis
function localAirGapRedactor(text) {
  let count = 0;
  const flags = [];
  let score = 15;

  let redacted = text;

  // Replace emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = redacted.match(emailRegex) || [];
  count += emails.length;
  redacted = redacted.replace(emailRegex, '[REDACTED_CONTACT]');

  // Replace phone numbers
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = redacted.match(phoneRegex) || [];
  count += phones.length;
  redacted = redacted.replace(phoneRegex, '[REDACTED_CONTACT]');

  // Replace salary / money amounts
  const salaryRegex = /\$\s?\d{1,3}(,\d{3})*(\.\d{2})?(\s?(per\s?year|\/yr|annually|hourly|\/hr))?/gi;
  const salaries = redacted.match(salaryRegex) || [];
  count += salaries.length;
  redacted = redacted.replace(salaryRegex, '[REDACTED_SALARY]');

  // Replace SSN / ID patterns
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssns = redacted.match(ssnRegex) || [];
  count += ssns.length;
  redacted = redacted.replace(ssnRegex, '[REDACTED_ID]');

  // Risk heuristics
  const lower = text.toLowerCase();
  if (lower.includes('non-compete') || lower.includes('not engage in any business') || lower.includes('24 months')) {
    score += 35;
    flags.push('Aggressive Non-Compete restriction detected');
  }
  if (lower.includes('all inventions') || lower.includes('prior to employment') || lower.includes('personal time')) {
    score += 30;
    flags.push('Broad Intellectual Property assignment clause detected');
  }
  if (lower.includes('equipment check') || lower.includes('wire') || lower.includes('cashiers check') || lower.includes('vendor check') || lower.includes('telegram')) {
    score += 50;
    flags.push('High-risk Advance-Fee / Equipment Check scam indicator');
  }
  if (lower.includes('indemnify') || lower.includes('hold harmless')) {
    score += 15;
    flags.push('Unilateral broad indemnification requirement');
  }

  score = Math.min(100, Math.max(5, score));

  let verdict = 'Low Risk Agreement';
  if (score >= 70) verdict = 'CRITICAL RISK: Dangerous clauses or scam indicators detected';
  else if (score >= 40) verdict = 'MODERATE RISK: Review non-standard restrictions';

  return {
    redactedText: redacted,
    piiRedactedCount: count,
    riskScore: score,
    detectedFlags: flags.length ? flags : ['No critical predatory clauses detected'],
    localVerdict: verdict
  };
}

// 4. Run Stage 1 Local Air-Gap Scan
btnRunAirGap.addEventListener('click', async () => {
  const rawText = inputText.value.trim();
  if (!rawText) {
    alert('Please enter or grab contract text to scan.');
    return;
  }

  btnRunAirGap.disabled = true;
  btnRunAirGap.textContent = 'Running On-Device Scan...';

  const startTime = performance.now();
  let result;

  try {
    const aiApi = window.ai || (window).LanguageModel;
    if (nanoAvailable && aiApi) {
      const lm = aiApi.languageModel || aiApi;
      const session = await lm.create({
        systemPrompt: "You are an on-device legal PII redactor and risk analyzer. Return strict JSON with: redactedText, piiRedactedCount, riskScore (0-100), detectedFlags (array of strings), localVerdict."
      });
      const prompt = `Sanitize all PII ([REDACTED_NAME], [REDACTED_CONTACT], [REDACTED_SALARY], [REDACTED_ID]) and evaluate risks:\n\n${rawText}`;
      const response = await session.prompt(prompt);
      try {
        const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
        result = JSON.parse(cleaned);
      } catch (parseErr) {
        result = localAirGapRedactor(rawText);
      }
    } else {
      result = localAirGapRedactor(rawText);
    }
  } catch (err) {
    console.warn('Gemini Nano prompt failed, falling back to local airgap logic:', err);
    result = localAirGapRedactor(rawText);
  }

  const latency = Math.round(performance.now() - startTime);

  // Update UI
  resultsCard.style.display = 'block';
  riskBadge.textContent = `${result.riskScore} / 100`;
  if (result.riskScore >= 70) {
    riskBadge.className = 'score-badge score-high';
  } else if (result.riskScore >= 40) {
    riskBadge.className = 'score-badge score-med';
  } else {
    riskBadge.className = 'score-badge score-low';
  }

  localVerdict.textContent = result.localVerdict;
  flagsList.innerHTML = '';
  (result.detectedFlags || []).forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    flagsList.appendChild(li);
  });

  redactedPreview.textContent = result.redactedText;
  latencySpan.textContent = `Latency: ${latency} ms`;
  bytesSpan.textContent = `Network: 0 Bytes Sent (Air-Gapped)`;

  btnRunAirGap.disabled = false;
  btnRunAirGap.textContent = 'Run Local Air-Gap Scan';
});

// 5. Open Web Studio
btnOpenWeb.addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:5173' });
});

// Initialize on open
checkNano();
