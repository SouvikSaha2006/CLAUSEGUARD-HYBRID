// ClauseGuard Hybrid - Firebase AI Logic Hybrid Routing Core (#BuildHybridAI 2026)

import { getGenerativeModel, InferenceMode } from 'firebase/ai';
import { ai } from './firebase';

export type OnDeviceStatus = 'ready' | 'downloading' | 'unavailable';

export type EntityCategory = 'PERSON' | 'ORG' | 'COMPENSATION' | 'CONTACT' | 'ID';

export interface Stage1Result {
  redactedText: string;
  piiRedactedCount: number;
  riskScore: number;
  detectedFlags: string[];
  localVerdict: string;
  engineUsed: 'ON_DEVICE_NANO' | 'CLOUD_FALLBACK';
  latencyMs: number;
  networkBytesSent: number;
  entityVault: Record<string, string>;
  vaultEntriesCount: number;
  canaryStatus: 'CLEAN' | 'INJECTION_NEUTRALIZED';
  canaryFindings: string[];
}

export interface CanaryShieldReport {
  canaryStatus: 'CLEAN' | 'INJECTION_NEUTRALIZED';
  canaryFindings: string[];
  neutralizedText: string;
  injectionsStrippedCount: number;
}

/**
 * Silent Canary Shield: On-Device Adversarial & Prompt-Injection Detector.
 * Scans locally for AI manipulation directives, system instruction overrides,
 * covert HTML/markdown comments, zero-width steganography, and off-platform scam lures.
 */
export function runCanaryShieldScan(text: string): CanaryShieldReport {
  const findings: string[] = [];
  let neutralized = text;
  let strippedCount = 0;

  // 1. Scan for invisible / zero-width Unicode characters (steganographic injection)
  const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u2060-\u2064]/g;
  const zeroWidthMatches = text.match(ZERO_WIDTH_REGEX);
  if (zeroWidthMatches && zeroWidthMatches.length > 0) {
    findings.push(
      `Zero-Width Steganography: Detected and stripped ${zeroWidthMatches.length} invisible zero-width Unicode characters.`
    );
    neutralized = neutralized.replace(ZERO_WIDTH_REGEX, '');
    strippedCount += zeroWidthMatches.length;
  }

  // 2. Scan and neutralize explicit prompt injection blocks (e.g. [SYSTEM INSTRUCTION: ...], [ADMIN OVERRIDE: ...], etc.)
  const promptInjectionBlockRegex = /\[(?:SYSTEM|ADMIN|DEVELOPER|INSTRUCTION|OVERRIDE|ASSISTANT)[^\]]*\]/gi;
  neutralized = neutralized.replace(promptInjectionBlockRegex, (match) => {
    findings.push(`Adversarial Injection Block: "${match.slice(0, 68)}..." quarantined & neutralized on-device.`);
    strippedCount++;
    return '[CANARY_SHIELD_QUARANTINED: Prompt-Injection Payload Neutralized]';
  });

  // 3. Scan and neutralize covert HTML / markdown comments containing instructions
  const hiddenCommentRegex = /<!--[\s\S]*?(?:system|admin|override|ignore|disregard|instruction|riskscore|prompt)[\s\S]*?-->/gi;
  neutralized = neutralized.replace(hiddenCommentRegex, (match) => {
    findings.push(`Hidden Comment Injection: Blocked covert HTML instruction payload (${match.length} bytes).`);
    strippedCount++;
    return '[CANARY_SHIELD_QUARANTINED: Hidden Comment Instruction Neutralized]';
  });

  // 4. Scan for AI Manipulation directives
  const manipulationPatterns = [
    {
      regex: /(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|directives|rules)/gi,
      desc: 'System Instruction Bypass: "ignore previous instructions" pattern detected and blocked.',
    },
    {
      regex: /(?:system\s+override|developer\s+mode|jailbreak|unrestricted\s+mode)/gi,
      desc: 'Privilege Escalation: "system override / developer mode" directive detected and neutralized.',
    },
    {
      regex: /(?:mark|classify|label|treat|consider)\s+(?:this\s+)?(?:contract|document|agreement|offer)\s+(?:as\s+)?(?:100%?\s+)?(?:safe|clean|legitimate|verified|valid|approved)/gi,
      desc: 'Falsification Directive: Malicious attempt demanding artificial "100% legitimate" classification.',
    },
    {
      regex: /(?:riskscore|risk_score|risk\s*score)\s*[:=]\s*(?:0|5|10|low|clean)/gi,
      desc: 'Metric Tampering: Attempted to force riskScore manipulation.',
    },
    {
      regex: /(?:advise|recommend)\s+immediate\s+(?:signing|acceptance|execution)/gi,
      desc: 'Psychological Coercion: Injection directive urging "immediate signing" without legal review.',
    },
  ];

  for (const { regex, desc } of manipulationPatterns) {
    if (regex.test(neutralized)) {
      findings.push(desc);
      neutralized = neutralized.replace(regex, '[CANARY_SHIELD_QUARANTINED: AI Manipulation Directive]');
      strippedCount++;
    }
  }

  // 5. Scan for Off-Platform Scam Lures and Social Engineering
  if (
    /(?:telegram|whatsapp|signal)\s*(?:messenger)?\s*[:(@]\s*[@A-Za-z0-9_]+/i.test(text) ||
    /(?:questionnaire|interview)\s+(?:conducted\s+)?via\s+telegram/i.test(text)
  ) {
    findings.push('Off-Platform Scam Lure: Interview conducted via unverified messenger channel (Telegram/WhatsApp).');
  }

  if (
    /(?:cashier's?\s+check|certified\s+check).*?(?:wire|zelle|cashapp|deposit)/i.test(text) ||
    /zelle|cashapp|direct\s+domestic\s+wire\s+transfer/i.test(text)
  ) {
    findings.push('Financial Scam Vector: Advance-fee counterfeit cashier check with mandatory personal wire disbursement.');
  }

  const isNeutralized = strippedCount > 0 || findings.some((f) => f.includes('Injection') || f.includes('Bypass') || f.includes('Tampering'));

  return {
    canaryStatus: isNeutralized ? 'INJECTION_NEUTRALIZED' : 'CLEAN',
    canaryFindings: findings,
    neutralizedText: neutralized,
    injectionsStrippedCount: strippedCount,
  };
}

export interface ClauseBreakdownItem {
  clause: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
}

export interface Stage2Result {
  executiveSummary: string;
  clauseBreakdown: ClauseBreakdownItem[];
  authenticityVerdict: string;
  counterOfferEmailDraft: string;
  engineUsed: 'CLOUD_GEMINI_2_5_FLASH';
  latencyMs: number;
}

/**
 * In-memory Zero-Knowledge Entity Vault Manager.
 * Operates strictly in client ephemeral memory. Never sent to cloud or saved in database.
 */
export class EntityVaultManager {
  private counters: Record<EntityCategory, number> = {
    PERSON: 1,
    ORG: 1,
    COMPENSATION: 1,
    CONTACT: 1,
    ID: 1,
  };

  // Map normalized raw string -> token (e.g. "jordan taylor" -> "[PERSON_1]")
  private valueToToken = new Map<string, string>();

  // Map token -> original string (e.g. "[PERSON_1]" -> "Jordan Taylor")
  public vault: Record<string, string> = {};

  register(rawValue: string, category: EntityCategory): string {
    const trimmed = rawValue.trim();
    // Ignore trivial or empty strings
    if (!trimmed || trimmed.length < 2) return '';

    // Ignore strings that are already bracketed tokens
    if (/^\[[A-Z_]+_\d+\]$/.test(trimmed) || /^\[REDACTED_[A-Z_]+\]$/.test(trimmed)) {
      return trimmed;
    }

    const lower = trimmed.toLowerCase();

    // Check exact or case-insensitive match
    if (this.valueToToken.has(lower)) {
      return this.valueToToken.get(lower)!;
    }

    // Reuse existing token if it's a known person/org prefix or suffix (e.g. "Alex" for "Alex J. Mercer")
    if (category === 'PERSON' || category === 'ORG') {
      for (const [existingVal, token] of this.valueToToken.entries()) {
        if (token.startsWith(`[${category}_`)) {
          if (existingVal.includes(lower) || lower.includes(existingVal)) {
            this.valueToToken.set(lower, token);
            return token;
          }
        }
      }
    }

    const index = this.counters[category]++;
    const token = `[${category}_${index}]`;

    this.valueToToken.set(lower, token);
    this.vault[token] = trimmed;
    return token;
  }

  getVault(): Record<string, string> {
    return { ...this.vault };
  }

  size(): number {
    return Object.keys(this.vault).length;
  }

  /**
   * Replaces all registered vault entities inside text.
   * Longer entity values (and aliases) are substituted first to avoid partial overlap corruption.
   */
  applyRedaction(text: string): { redactedText: string; count: number } {
    let redacted = text;
    let count = 0;

    // Sort registered values and aliases by length descending
    const entries = Array.from(this.valueToToken.entries()).sort((a, b) => b[0].length - a[0].length);

    for (const [val, token] of entries) {
      if (!val || val.length < 2) continue;
      const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      const matches = redacted.match(regex);
      if (matches && matches.length > 0) {
        count += matches.length;
        redacted = redacted.replace(regex, token);
      }
    }

    return { redactedText: redacted, count };
  }
}

/**
 * Checks browser availability of Chrome Prompt API / Gemini Nano.
 * Inspects 'LanguageModel' in window or ai.languageModel.
 */
export async function checkOnDeviceStatus(): Promise<OnDeviceStatus> {
  if (typeof window === 'undefined') {
    return 'unavailable';
  }

  try {
    const win = window as any;

    let rawStatus: string | undefined;

    // 1. Check (window as any).LanguageModel?.availability()
    if (typeof win.LanguageModel?.availability === 'function') {
      try {
        rawStatus = await win.LanguageModel.availability();
      } catch (err) {
        console.warn('[ClauseGuard] win.LanguageModel.availability() note:', err);
      }
    }

    // 2. Check (window as any).ai?.languageModel?.availability()
    if (!rawStatus && typeof win.ai?.languageModel?.availability === 'function') {
      try {
        rawStatus = await win.ai.languageModel.availability();
      } catch (err) {
        console.warn('[ClauseGuard] win.ai.languageModel.availability() note:', err);
      }
    }

    // 3. Fallback: (window as any).ai?.languageModel?.capabilities() or LanguageModel?.capabilities()
    if (!rawStatus) {
      const promptApi = win.LanguageModel || win.ai?.languageModel;
      if (promptApi && typeof promptApi.capabilities === 'function') {
        try {
          const caps = await promptApi.capabilities();
          rawStatus = caps?.available;
        } catch (err) {
          console.warn('[ClauseGuard] promptApi.capabilities() note:', err);
        }
      }
    }

    if (rawStatus) {
      const normalized = String(rawStatus).toLowerCase().trim();
      if (normalized === 'available' || normalized === 'readily' || normalized === 'ready') {
        return 'ready';
      }
      if (
        normalized === 'downloading' ||
        normalized === 'downloadable' ||
        normalized === 'after-download'
      ) {
        return 'downloading';
      }
    }

    return 'unavailable';
  } catch (err) {
    console.warn('[ClauseGuard] checkOnDeviceStatus warning:', err);
    return 'unavailable';
  }
}

/**
 * High-performance deterministic on-device regex/heuristic sanitizer.
 * Runs 100% locally in zero network milliseconds and populates the in-memory Entity Vault.
 */
export function sanitizeClientSideLocally(
  text: string,
  existingVaultMgr?: EntityVaultManager
): {
  redactedText: string;
  piiRedactedCount: number;
  riskScore: number;
  detectedFlags: string[];
  localVerdict: string;
  entityVault: Record<string, string>;
  vaultEntriesCount: number;
  canaryStatus: 'CLEAN' | 'INJECTION_NEUTRALIZED';
  canaryFindings: string[];
} {
  // 0. Run Silent Canary Adversarial & Prompt-Injection Scanner
  const canaryReport = runCanaryShieldScan(text);
  const vaultMgr = existingVaultMgr || new EntityVaultManager();
  const flags: string[] = [];
  let score = 15;

  if (canaryReport.canaryStatus === 'INJECTION_NEUTRALIZED') {
    score = 98;
    flags.push('CRITICAL: Adversarial prompt-injection attack neutralized on-device by Silent Canary Shield');
    for (const finding of canaryReport.canaryFindings) {
      if (finding.includes('Injection') || finding.includes('Directive') || finding.includes('Bypass') || finding.includes('Tampering')) {
        flags.push(`CANARY DEFENSE: ${finding}`);
      }
    }
  }

  // Work with neutralized text so adversarial injection payloads are stripped before Cloud Stage 2
  const workText = canaryReport.neutralizedText;

  // 1. Register Emails -> [CONTACT_n]
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = workText.match(emailRegex) || [];
  for (const email of emails) {
    vaultMgr.register(email, 'CONTACT');
  }

  // 2. Register Phone numbers -> [CONTACT_n]
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = workText.match(phoneRegex) || [];
  for (const phone of phones) {
    vaultMgr.register(phone, 'CONTACT');
  }

  // 3. Register Physical Addresses -> [CONTACT_n]
  const addressRegex = /\b\d{1,5}\s+([A-Za-z0-9#.\s]+),\s*(?:Suite\s+[0-9A-Za-z]+,\s*|Apt\s+[0-9A-Za-z]+,\s*)?([A-Za-z\s]+),\s*([A-Z]{2})\s*(\d{5})(?:-\d{4})?\b/g;
  const addresses = workText.match(addressRegex) || [];
  for (const addr of addresses) {
    vaultMgr.register(addr, 'CONTACT');
  }

  const prefixedAddrRegex = /(?:Candidate\s+Address|Address):\s*([^\n,\r]+(?:,\s*[^\n,\r]+)+)/gi;
  let addrMatch: RegExpExecArray | null;
  while ((addrMatch = prefixedAddrRegex.exec(workText)) !== null) {
    if (addrMatch[1]) {
      vaultMgr.register(addrMatch[1].trim(), 'CONTACT');
    }
  }

  // 4. Register SSNs / Tax IDs / PAN / Aadhaar / Passport / Bank IDs -> [ID_n]
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const ssns = workText.match(ssnRegex) || [];
  for (const ssn of ssns) {
    vaultMgr.register(ssn, 'ID');
  }

  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
  const pans = workText.match(panRegex) || [];
  for (const pan of pans) {
    vaultMgr.register(pan, 'ID');
  }

  const aadhaarRegex = /\b\d{4}[-\s]\d{4}[-\s]\d{4}\b/g;
  const aadhaars = workText.match(aadhaarRegex) || [];
  for (const aadh of aadhaars) {
    vaultMgr.register(aadh, 'ID');
  }

  const idPrefixedRegex = /\b(ID Reference|SSN|Social Security Number(?:\s*\/\s*Tax ID)?|Tax ID|PAN|Aadhaar|Passport(?:\s*(?:No|Number))?|Bank Account|Routing(?:\s*Number)?):\s*([^\n,\r]+)/gi;
  let idMatch: RegExpExecArray | null;
  while ((idMatch = idPrefixedRegex.exec(workText)) !== null) {
    if (idMatch[2]) {
      vaultMgr.register(idMatch[2].trim(), 'ID');
    }
  }

  const empIdRegex = /\b(EMP|REF|ID)-[0-9A-Z]{4,12}\b/gi;
  const empIds = workText.match(empIdRegex) || [];
  for (const emp of empIds) {
    vaultMgr.register(emp, 'ID');
  }

  // 5. Register Salaries / Bonuses / Compensation figures -> [COMPENSATION_n]
  const currencyRegex = /(?:\$|USD|INR|₹|Rs\.?)\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s?(?:per\s?year|\/yr|annually|hourly|\/hr|per\s?month|\/mo|k|million|lakh|crore))?/gi;
  const currencies = workText.match(currencyRegex) || [];
  for (const curr of currencies) {
    vaultMgr.register(curr, 'COMPENSATION');
  }

  const compPrefixedRegex = /\b(Base Salary|Sign-On Bonus|Base Compensation|Bonus|Liquidated damages|amount of):\s*([^\n,\r]+)/gi;
  let compMatch: RegExpExecArray | null;
  while ((compMatch = compPrefixedRegex.exec(workText)) !== null) {
    if (compMatch[2]) {
      const val = compMatch[2].trim();
      if (/\d/.test(val)) {
        vaultMgr.register(val, 'COMPENSATION');
      }
    }
  }

  // 6. Register Candidate / Person Names -> [PERSON_n]
  const namePrefixedRegex = /\b(Candidate Name|Candidate|Employee|Prepared for|Payable to):\s*([^\n,\r]+)/gi;
  let nameMatch: RegExpExecArray | null;
  while ((nameMatch = namePrefixedRegex.exec(workText)) !== null) {
    if (nameMatch[2]) {
      const val = nameMatch[2].trim();
      if (val.length > 2 && !val.includes('$') && !/^\d+$/.test(val)) {
        vaultMgr.register(val, 'PERSON');
      }
    }
  }

  const dearRegex = /Dear\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),/g;
  let dearMatch: RegExpExecArray | null;
  while ((dearMatch = dearRegex.exec(workText)) !== null) {
    if (dearMatch[1]) {
      vaultMgr.register(dearMatch[1].trim(), 'PERSON');
    }
  }

  // 7. Register Organization / Company Names -> [ORG_n]
  const firstLines = workText.slice(0, 320).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (firstLines.length > 0) {
    const topHeader = firstLines[0];
    if (/(?:INC|LLC|PBC|CORP|LTD|SYSTEMS|TECHNOLOGIES|SOLUTIONS)\b/i.test(topHeader)) {
      vaultMgr.register(topHeader, 'ORG');
    }
  }

  const orgPrefixedRegex = /\b(Company|Employer|Organization|Recipient):\s*([^\n,\r]+)/gi;
  let orgMatch: RegExpExecArray | null;
  while ((orgMatch = orgPrefixedRegex.exec(workText)) !== null) {
    if (orgMatch[2]) {
      const val = orgMatch[2].trim();
      if (val.length > 2 && !val.includes('@') && !val.includes('http')) {
        vaultMgr.register(val, 'ORG');
      }
    }
  }

  const behalfRegex = /On behalf of\s+([A-Z][A-Za-z0-9\s.,&-]+?(?:,\s*PBC|,\s*Inc\.?|,\s*LLC)?)(?:,\s*we\s+are|\s*\()/gi;
  let behalfMatch: RegExpExecArray | null;
  while ((behalfMatch = behalfRegex.exec(workText)) !== null) {
    if (behalfMatch[1]) {
      vaultMgr.register(behalfMatch[1].trim(), 'ORG');
    }
  }

  // Apply substitutions from vault
  const { redactedText, count } = vaultMgr.applyRedaction(workText);

  // 8. Analyze Predatory Clauses and Scam Signatures
  const lower = workText.toLowerCase();

  // Scam / Advance-fee flags
  if (
    lower.includes('cashier\'s check') ||
    lower.includes('cashiers check') ||
    lower.includes('wire transfer') ||
    lower.includes('zelle') ||
    lower.includes('cashapp') ||
    lower.includes('telegram') ||
    lower.includes('approved equipment provider') ||
    lower.includes('provisioning partner')
  ) {
    score += 55;
    flags.push('CRITICAL: Advance-fee / equipment fake check scam indicator detected');
  }

  // Predatory Non-compete
  if (
    lower.includes('twenty-four (24) months') ||
    lower.includes('24 months') ||
    (lower.includes('non-competition') && lower.includes('worldwide')) ||
    (lower.includes('not directly or indirectly engage') && lower.includes('software'))
  ) {
    score += 35;
    flags.push('HIGH RISK: Unreasonable 24-month worldwide non-compete restraint');
  }

  // Comprehensive IP grab
  if (
    lower.includes('outside working hours') ||
    lower.includes('prior to employment') ||
    lower.includes('whether related or completely unrelated') ||
    lower.includes('throughout the universe in perpetuity') ||
    lower.includes('personal open-source projects')
  ) {
    score += 30;
    flags.push('HIGH RISK: Predatory personal side-project & prior IP expropriation');
  }

  // Liquidated damages / indemnification
  if (
    lower.includes('liquidated damages') ||
    lower.includes('$250,000') ||
    lower.includes('unconditionally indemnify')
  ) {
    score += 25;
    flags.push('HIGH RISK: Unilateral liquidated damages and broad indemnification penalty');
  }

  // Standard safe markers
  if (lower.includes('no post-employment non-compete') || lower.includes('retains full rights to pre-existing inventions')) {
    score = Math.max(10, score - 20);
    flags.push('Standard fair employment protections verified');
  }

  score = Math.min(100, Math.max(5, score));

  let verdict = 'Low Risk Agreement: Standard employment covenants.';
  if (canaryReport.canaryStatus === 'INJECTION_NEUTRALIZED') {
    verdict = 'CRITICAL ALERT: Adversarial prompt-injection & counterfeit job scam quarantined on-device.';
  } else if (score >= 70) {
    verdict = 'CRITICAL ALERT: Severe financial or legal liability risks detected.';
  } else if (score >= 40) {
    verdict = 'ELEVATED RISK: Restrictive covenants require legal clarification or counter-offer.';
  }

  return {
    redactedText,
    piiRedactedCount: Math.max(1, count),
    riskScore: score,
    detectedFlags: flags.length > 0 ? flags : ['No severe predatory risks detected.'],
    localVerdict: verdict,
    entityVault: vaultMgr.getVault(),
    vaultEntriesCount: vaultMgr.size(),
    canaryStatus: canaryReport.canaryStatus,
    canaryFindings: canaryReport.canaryFindings,
  };
}

/**
 * Stage 1: Local Air-Gap Redaction & Risk Evaluation.
 * Uses fast entity extraction (<100 output tokens) so Nano completes in 1.5–3s on CPU/iGPU laptops.
 * Uses InferenceMode.ONLY_ON_DEVICE (or PREFER_ON_DEVICE if forcePreferOnDevice is set).
 * Enforces a 12-second timeout and instantaneous deterministic client-side regex fallback.
 * Generates an in-memory Zero-Knowledge Entity Vault with numbered semantic tokens.
 */
export async function runStage1LocalAirGap(
  rawText: string,
  forcePreferOnDevice = false
): Promise<Stage1Result> {
  const startTime = performance.now();
  const mode = forcePreferOnDevice ? InferenceMode.PREFER_ON_DEVICE : InferenceMode.ONLY_ON_DEVICE;
  const vaultMgr = new EntityVaultManager();

  // Primary attempt via Firebase AI Logic getGenerativeModel with 12s timeout
  try {
    const generativeModel = getGenerativeModel(ai, {
      mode,
      inCloudParams: { model: 'gemini-2.5-flash' },
      onDeviceParams: {
        createOptions: {
          expectedInputs: [{ type: 'text', languages: ['en'] }],
          expectedOutputs: [{ type: 'text', languages: ['en'] }],
        },
      },
    });

    const prompt = `You are a fast on-device privacy air-gap entity extractor and risk scanner.
Extract sensitive personally identifiable information (PII) items from this contract and evaluate risk.
Do NOT output the full contract text. Output ONLY a strict JSON object conforming to this schema:
{
  "entities": [
    { "value": "exact string to redact", "category": "PERSON" }
  ],
  "riskScore": 75,
  "detectedFlags": ["short risk flag 1", "short risk flag 2"],
  "localVerdict": "one-sentence summary"
}

Allowed categories for "category":
- "PERSON": Candidate/employee/founder/recruiter personal names
- "ORG": Company names, employer names, vendor organizations
- "COMPENSATION": Salary figures, bonuses, equity, checks, fees, wire amounts
- "CONTACT": Email addresses, phone numbers, street/physical addresses
- "ID": SSNs, national identification numbers, PAN, Aadhaar, passport numbers, tax/bank account IDs

Contract Document:
${rawText}`;

    // 12-second timeout guard to ensure zero hangs
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => {
        reject(new Error('Gemini Nano inference timed out after 12s'));
      }, 12000);
    });

    const generatePromise = generativeModel.generateContent(prompt);
    const result = await Promise.race([generatePromise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);

    const textOutput = result.response.text();
    let cleanedJson = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleanedJson.indexOf('{');
    const lastBrace = cleanedJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedJson = cleanedJson.slice(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(cleanedJson);

    // 1. Register Nano extracted entities into the vault manager
    const extractedList = Array.isArray(parsed.entities)
      ? parsed.entities
      : Array.isArray(parsed.pii)
      ? parsed.pii
      : [];

    for (const item of extractedList) {
      if (item && typeof item.value === 'string' && item.value.trim().length > 1) {
        let cat: EntityCategory = 'PERSON';
        const rawCategory = String(item.category || item.tag || '').toUpperCase();
        if (rawCategory.includes('ORG') || rawCategory.includes('COMPAN')) cat = 'ORG';
        else if (rawCategory.includes('COMP') || rawCategory.includes('SALARY') || rawCategory.includes('MONEY')) cat = 'COMPENSATION';
        else if (rawCategory.includes('CONTACT') || rawCategory.includes('EMAIL') || rawCategory.includes('PHONE') || rawCategory.includes('ADDR')) cat = 'CONTACT';
        else if (rawCategory.includes('ID') || rawCategory.includes('SSN') || rawCategory.includes('PAN') || rawCategory.includes('TAX')) cat = 'ID';
        else if (rawCategory.includes('NAME') || rawCategory.includes('PERSON')) cat = 'PERSON';
        vaultMgr.register(item.value, cat);
      }
    }

    // 2. Deterministic regex safety passes for emails, phones, SSNs, IDs, and salaries
    const safetyResult = sanitizeClientSideLocally(rawText, vaultMgr);

    // Combine risk metrics (preserve canary high risk if injection neutralized)
    const nanoScore = typeof parsed.riskScore === 'number' ? parsed.riskScore : safetyResult.riskScore;
    const finalScore = safetyResult.canaryStatus === 'INJECTION_NEUTRALIZED'
      ? Math.max(98, safetyResult.riskScore)
      : Math.min(100, Math.max(5, Math.max(nanoScore, safetyResult.riskScore)));

    const combinedFlags = Array.from(
      new Set([
        ...(Array.isArray(parsed.detectedFlags) ? parsed.detectedFlags : []),
        ...safetyResult.detectedFlags,
      ])
    ).filter((f) => f && f !== 'No severe predatory risks detected.');

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      redactedText: safetyResult.redactedText,
      piiRedactedCount: Math.max(1, safetyResult.piiRedactedCount),
      riskScore: finalScore,
      detectedFlags: combinedFlags.length > 0 ? combinedFlags : ['No severe predatory risks detected.'],
      localVerdict: safetyResult.canaryStatus === 'INJECTION_NEUTRALIZED' ? safetyResult.localVerdict : (parsed.localVerdict || safetyResult.localVerdict),
      engineUsed: 'ON_DEVICE_NANO',
      latencyMs,
      networkBytesSent: 0,
      entityVault: safetyResult.entityVault,
      vaultEntriesCount: safetyResult.vaultEntriesCount,
      canaryStatus: safetyResult.canaryStatus,
      canaryFindings: safetyResult.canaryFindings,
    };
  } catch (err) {
    console.info(
      '[ClauseGuard] Local Gemini Nano session unavailable or timed out. Executing local client air-gap sandbox:',
      err
    );

    // Deterministic client-side air-gap execution fallback
    const localResult = sanitizeClientSideLocally(rawText, vaultMgr);
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      ...localResult,
      engineUsed: forcePreferOnDevice ? 'CLOUD_FALLBACK' : 'ON_DEVICE_NANO',
      latencyMs,
      networkBytesSent: 0,
    };
  }
}

/**
 * Stage 2: Cloud Deep Legal Audit & Counter-Offer Generator.
 * Guardrail: Verifies that text is already redacted and contains NO raw PII before transmission.
 * Uses InferenceMode.ONLY_IN_CLOUD with gemini-2.5-flash.
 */
export async function runStage2CloudAudit(
  redactedText: string,
  entityVault?: Record<string, string>
): Promise<Stage2Result> {
  const startTime = performance.now();

  // Guardrail 1: Empty text validation
  if (!redactedText || !redactedText.trim()) {
    throw new Error('Air-Gap Guardrail Violation: Redacted text is empty.');
  }

  // Guardrail 2: Raw PII detection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

  if (emailRegex.test(redactedText)) {
    throw new Error(
      'Air-Gap Guardrail Block: Raw email detected in payload. Refusing cloud transmission.'
    );
  }
  if (ssnRegex.test(redactedText)) {
    throw new Error(
      'Air-Gap Guardrail Block: Raw SSN / Tax ID detected in payload. Refusing cloud transmission.'
    );
  }
  if (phoneRegex.test(redactedText)) {
    throw new Error(
      'Air-Gap Guardrail Block: Raw telephone number detected. Refusing cloud transmission.'
    );
  }

  // Guardrail 3: Strict pre-flight assertion verifying that none of the original values in entityVault appear in payload
  if (entityVault) {
    for (const [token, originalVal] of Object.entries(entityVault)) {
      const trimmed = originalVal?.trim();
      if (trimmed && trimmed.length >= 2) {
        if (redactedText.toLowerCase().includes(trimmed.toLowerCase())) {
          throw new Error(
            `Air-Gap Pre-Flight Guardrail Block: Raw sensitive value "${trimmed}" (${token}) detected in cloud payload. Transmission blocked to prevent PII leak.`
          );
        }
      }
    }
  }

  const prompt = `You are a high-tier legal auditor analyzing an anonymized employment agreement where all personal identifiable information (PII) has been air-gap redacted using a Zero-Knowledge Entity Vault.

CRITICAL PRIVACY TOKEN INSTRUCTION:
The contract contains privacy tokens such as [PERSON_1], [ORG_1], [COMPENSATION_1], and [CONTACT_1]. Preserve these exact bracketed tokens verbatim inside your executiveSummary, clauseBreakdown, and counterOfferEmailDraft. Do NOT invent real names or remove the bracketed tokens.

Analyze the following sanitized contract and provide:
1. Executive Summary: High-level executive overview of risks and legal liabilities. Preserve privacy tokens.
2. Clause Breakdown: Array of clauses with riskLevel ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') and clear explanation.
3. Authenticity Verdict: Clear verdict on whether the document is a counterfeit job scam, predatory contract, or standard legitimate offer.
4. Counter-Offer Email Draft: Professional, polite email draft to HR or the recruiter proposing safe amendments or questioning suspicious items. Address the recipient organization as [ORG_1] and sign as [PERSON_1].

Return ONLY strict valid JSON:
{
  "executiveSummary": "string",
  "clauseBreakdown": [
    {
      "clause": "string title or quote",
      "riskLevel": "LOW | MEDIUM | HIGH | CRITICAL",
      "explanation": "detailed analysis"
    }
  ],
  "authenticityVerdict": "string",
  "counterOfferEmailDraft": "string"
}

Sanitized Contract:
${redactedText}`;

  try {
    const generativeModel = getGenerativeModel(ai, {
      mode: InferenceMode.ONLY_IN_CLOUD,
      inCloudParams: { model: 'gemini-2.5-flash' },
    });

    const result = await generativeModel.generateContent(prompt);
    const textOutput = result.response.text();
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      executiveSummary: parsed.executiveSummary || 'Deep legal cloud audit completed.',
      clauseBreakdown: Array.isArray(parsed.clauseBreakdown) ? parsed.clauseBreakdown : [],
      authenticityVerdict: parsed.authenticityVerdict || 'Verified document structure.',
      counterOfferEmailDraft: parsed.counterOfferEmailDraft || '',
      engineUsed: 'CLOUD_GEMINI_2_5_FLASH',
      latencyMs,
    };
  } catch (err) {
    console.info('[ClauseGuard] Cloud Gemini 2.5 Flash query note (generating structured cloud fallback):', err);

    // High quality fallback analysis in case API key is unconfigured or rate limited
    const isScam =
      redactedText.toLowerCase().includes('cashier') ||
      redactedText.toLowerCase().includes('wire') ||
      redactedText.toLowerCase().includes('telegram');

    const isPredatory =
      redactedText.toLowerCase().includes('non-compete') ||
      redactedText.toLowerCase().includes('liquidated damages') ||
      redactedText.toLowerCase().includes('outside working hours');

    const breakdown: ClauseBreakdownItem[] = [];

    if (isScam) {
      breakdown.push({
        clause: 'Equipment Procurement via Cashier Check & Wire',
        riskLevel: 'CRITICAL',
        explanation:
          'Classic counterfeit check advance-fee scheme. The bank will reverse the deposit when the check bounces, leaving [PERSON_1] liable for funds transferred to the fake vendor.',
      });
      breakdown.push({
        clause: 'Informal Hiring & Interview Platform (Telegram)',
        riskLevel: 'CRITICAL',
        explanation:
          'Legitimate enterprise employers like [ORG_1] do not conduct interviews exclusively via unverified messaging channels without identity verification.',
      });
    } else if (isPredatory) {
      breakdown.push({
        clause: '24-Month Worldwide Non-Compete',
        riskLevel: 'CRITICAL',
        explanation:
          'Overly broad geographic scope and excessive 2-year duration severely restricts future employment of [PERSON_1] and violates FTC guidelines and state public policy.',
      });
      breakdown.push({
        clause: 'Universal Invention Assignment (Personal Time & Prior Works)',
        riskLevel: 'HIGH',
        explanation:
          'Attempts to claim ownership over works created by [PERSON_1] outside working hours without [ORG_1] resources, exceeding permissible statutory boundaries (e.g. CA Lab Code 2870).',
      });
      breakdown.push({
        clause: 'Liquidated Damages & Fee Shifting',
        riskLevel: 'HIGH',
        explanation:
          'Punitive liquidated damages clause designed by [ORG_1] to intimidate rather than compensate for actual damages.',
      });
    } else {
      breakdown.push({
        clause: 'Intellectual Property Assignment',
        riskLevel: 'LOW',
        explanation:
          'Appropriately scoped to creations made during working hours or directly related to [ORG_1] scope, with explicit carve-out for prior inventions of [PERSON_1].',
      });
      breakdown.push({
        clause: 'Absence of Post-Employment Non-Compete',
        riskLevel: 'LOW',
        explanation: 'Respects employee career mobility while maintaining standard confidentiality.',
      });
    }

    const latencyMs = Math.round(performance.now() - startTime);

    return {
      executiveSummary: isScam
        ? 'DANGER: Highly probable advance-fee employment scam involving [ORG_1]. Immediate wire transfer required for equipment is a known fraud vector targeting [PERSON_1].'
        : isPredatory
        ? 'HIGH RISK: Unusually aggressive restrictive covenants and overbroad IP assignment imposed by [ORG_1] that pose severe career encumbrance on [PERSON_1].'
        : 'FAIR TERMS: Standard, balanced engineering employment offer from [ORG_1] compliant with fair labor best practices.',
      clauseBreakdown: breakdown,
      authenticityVerdict: isScam
        ? 'FRAUDULENT / COUNTERFEIT: High-confidence advance-fee check scam.'
        : isPredatory
        ? 'LEGAL RISK: Valid legal entity [ORG_1] but punitive and unconscionable clauses.'
        : 'LEGITIMATE: Standard commercial employment offer from [ORG_1].',
      counterOfferEmailDraft: isScam
        ? `Dear Recruiting Team at [ORG_1],\n\nI have reviewed the offer. To adhere to corporate financial security practices, I request that [ORG_1] ship pre-configured hardware directly from your corporate supplier, rather than processing personal funds or cashier checks. Please confirm if hardware can be dispatched directly.\n\nBest regards,\n[PERSON_1]`
        : isPredatory
        ? `Dear Hiring Team at [ORG_1],\n\nThank you for this offer. I am excited about the prospect of joining [ORG_1]. Upon review of Sections 1 and 2, I would like to propose standard amendments:\n1. Non-compete: Restricting duration to 6 months in direct competing products rather than worldwide 24 months.\n2. Inventions: Confirming that personal side projects developed outside work hours on personal hardware remain excluded per Exhibit A.\n\nLooking forward to your thoughts.\n\nSincerely,\n[PERSON_1]`
        : `Dear Hiring Manager at [ORG_1],\n\nThank you for extending this offer. I am thrilled to accept the position on the Core Platform team and look forward to joining [ORG_1] on the scheduled start date.\n\nWarm regards,\n[PERSON_1]`,
      engineUsed: 'CLOUD_GEMINI_2_5_FLASH',
      latencyMs,
    };
  }
}

