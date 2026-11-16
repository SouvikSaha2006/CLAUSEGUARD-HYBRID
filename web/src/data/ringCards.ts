// ClauseGuard Hybrid (#BuildHybridAI 2026)
// ringCards.ts - 16 Threat & Guardrail Ring Cards with dedicated poster images

export type WorldType = 'build' | 'brand' | 'learn';

export interface RingCardData {
  id: string;
  slotNumber: string; // "No. 01" .. "No. 16"
  index: number;
  world: WorldType;
  worldLabel: string;
  worldColor: string;
  onTextColor: string;
  title: string;
  blurb: string;
  posterUrl: string;
  videoUrl?: string;
  sampleContract: string;
  presetId?: string;
}

export const RING_16_CARDS: RingCardData[] = [
  {
    id: 'slot-1',
    slotNumber: 'No. 01',
    index: 1,
    world: 'build',
    worldLabel: 'BUILD',
    worldColor: '#3AA8D0',
    onTextColor: '#04121A',
    title: 'Founder IP Assignment',
    blurb: 'Protects pre-incorporation repositories and patent filings while excluding prior personal moonlighting inventions.',
    posterUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=720&q=80',
    sampleContract: `CONFIDENTIAL FOUNDER PROPRIETARY RIGHTS AGREEMENT
Company: NexusForge Labs, Inc. (Delaware C-Corp)
Founder: Samantha Vance | Date: Nov 16, 2026

1. SCOPE OF ASSIGNMENT: Founder assigns to Company all right, title, and interest in inventions conceived during the term of association.
2. PRIOR INVENTIONS EXCLUSION: Exhibit A expressly carves out pre-incorporation personal open-source libraries and independent research models.
3. GOVERNING LAW: State of Delaware.`,
  },
  {
    id: 'slot-2',
    slotNumber: 'No. 02',
    index: 2,
    world: 'brand',
    worldLabel: 'BRAND',
    worldColor: '#EEF4F6',
    onTextColor: '#0A0E11',
    title: 'Fake Equipment Check Scam',
    blurb: 'Counterfeit $4,850 cashier check with urgent wire/Zelle transfer to an unverified third-party hardware supplier.',
    posterUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=720&q=80',
    presetId: 'fake-remote-tech-scam',
    sampleContract: `APEXCLOUD SOLUTIONS GLOBAL INC.
EMPLOYMENT OFFER & HOME OFFICE ONBOARDING AGREEMENT
Date: November 14, 2026 | Candidate: Alex J. Mercer

4. EQUIPMENT PROCUREMENT PROTOCOL & ADVANCE CHECK
The Company will issue a corporate certified cashier's check in the amount of $4,850.00 payable to Alex J. Mercer.
Candidate must deposit check and immediately withdraw $4,650.00 to transfer via Zelle or wire to: Global Hardware Logistics LLC.
WARNING: Failure to execute vendor wire within 24 hours results in offer revocation and legal referral.`,
  },
  {
    id: 'slot-3',
    slotNumber: 'No. 03',
    index: 3,
    world: 'learn',
    worldLabel: 'LEARN',
    worldColor: '#9ED8E4',
    onTextColor: '#0E2A3B',
    title: '24-Mo Worldwide Non-Compete',
    blurb: 'Draconian worldwide non-compete combined with $250,000 liquidated damages penalty on any competitive software role.',
    posterUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=720&q=80',
    presetId: 'predatory-non-compete-ip-trap',
    sampleContract: `OMNICORP DYNAMIC SYSTEMS LLC
RESTRICTIVE COVENANTS AND INVENTIONS AGREEMENT
Employee: Jordan Taylor | Base Salary: $195,000

SECTION 2: WORLDWIDE NON-COMPETE RESTRICTION
For 24 months post-termination, Employee shall not directly or indirectly engage in or consult with any entity worldwide operating in software, AI, or cloud infrastructure.
SECTION 3: LIQUIDATED DAMAGES
Employee agrees to pay $250,000.00 as liquidated damages per violation plus all corporate attorney fees.`,
  },
  {
    id: 'slot-4',
    slotNumber: 'No. 04',
    index: 4,
    world: 'build',
    worldLabel: 'BUILD',
    worldColor: '#3AA8D0',
    onTextColor: '#04121A',
    title: 'Clean Engineering Offer',
    blurb: 'Standard equitable employment offer with direct corporate hardware shipping and zero post-employment non-compete.',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=720&q=80',
    presetId: 'clean-standard-offer',
    sampleContract: `BEACON OPEN TECHNOLOGIES, PBC
EMPLOYMENT OFFER LETTER
Candidate: Morgan Lee | Position: Senior Full-Stack Engineer

3. HARDWARE & EXPENSES: Pre-configured MacBook Pro shipped directly at zero cost to employee.
4. INTELLECTUAL PROPERTY: Employee assigns works created within scope of employment during working hours. Pre-existing inventions retained.
5. RESTRICTIVE COVENANTS: Agreement contains NO post-employment non-compete clause.`,
  },
  {
    id: 'slot-5',
    slotNumber: 'No. 05',
    index: 5,
    world: 'brand',
    worldLabel: 'BRAND',
    worldColor: '#EEF4F6',
    onTextColor: '#0A0E11',
    title: 'Telegram HR Recruiter Trap',
    blurb: 'Waived technical evaluations and immediate high-salary job offer conducted exclusively over encrypted messenger.',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80',
    sampleContract: `GLOBAL SYNERGY DYNAMICS LLC
TELECOMMUTE EMPLOYMENT AUTHORIZATION
Interviewer: HR Recruiting Lead (@GlobalSynergyCareers on Telegram)

Dear Candidate, We have reviewed your responses to our Telegram screening assessment. We are pleased to waive standard interview rounds and offer you $175,000/year starting immediately upon hardware procurement check processing.`,
  },
  {
    id: 'slot-6',
    slotNumber: 'No. 06',
    index: 6,
    world: 'learn',
    worldLabel: 'LEARN',
    worldColor: '#9ED8E4',
    onTextColor: '#0E2A3B',
    title: 'Moonlight IP Expropriation',
    blurb: 'Expropriates all personal weekend repositories, side hobbies, and personal code developed outside work hours.',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=720&q=80',
    sampleContract: `TALENTEDGE VENTURES INC.
PROPRIETARY INFORMATION & INVENTIONS ASSIGNMENT
Employee acknowledges that all software code, apps, algorithms, and writings created outside business hours, whether on personal devices or personal time, belong exclusively to Company throughout the universe in perpetuity.`,
  },
  {
    id: 'slot-7',
    slotNumber: 'No. 07',
    index: 7,
    world: 'build',
    worldLabel: 'BUILD',
    worldColor: '#3AA8D0',
    onTextColor: '#04121A',
    title: 'SAFE & Equity Cliff Covenants',
    blurb: 'Standard 4-year vesting with 1-year cliff and double-trigger change of control acceleration.',
    posterUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=720&q=80',
    sampleContract: `HORIZON CLOUD ARCHITECTURES PBC
STOCK INCENTIVE GRANT AGREEMENT
Option Grant: 25,000 Common Shares | 1-Year Cliff | 48-Month Vesting
Double-trigger acceleration protects equity in the event of acquisition or involuntary termination without cause.`,
  },
  {
    id: 'slot-8',
    slotNumber: 'No. 08',
    index: 8,
    world: 'brand',
    worldLabel: 'BRAND',
    worldColor: '#EEF4F6',
    onTextColor: '#0A0E11',
    title: 'Check Bounce Wire Reversal',
    blurb: 'Bank reverses fraudulent check deposit days later, holding victim liable for thousands wired to scammers.',
    posterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=720&q=80',
    sampleContract: `SECURITY ADVISORY NOTE: FRAUD PATTERN
Notice of Returned Check Instrument: Fake certified check deposit bounced upon clearing cycle.
Account holder is personally liable for $4,650 disbursed via irrevocable wire transfer to third-party vendor.`,
  },
  {
    id: 'slot-9',
    slotNumber: 'No. 09',
    index: 9,
    world: 'learn',
    worldLabel: 'LEARN',
    worldColor: '#9ED8E4',
    onTextColor: '#0E2A3B',
    title: 'Uncapped Indemnification Trap',
    blurb: 'Forces employee or contractor to personally defend and indemnify company from all operational liabilities.',
    posterUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=720&q=80',
    sampleContract: `METROLOGIC CONTRACTOR MASTER SERVICES AGREEMENT
SECTION 9: INDEMNIFICATION
Contractor shall unconditionally defend, indemnify, and hold harmless Client, its officers, and affiliates against any and all losses, claims, and third-party damages arising from Contractor's code deliverables without financial cap.`,
  },
  {
    id: 'slot-10',
    slotNumber: 'No. 10',
    index: 10,
    world: 'build',
    worldLabel: 'BUILD',
    worldColor: '#3AA8D0',
    onTextColor: '#04121A',
    title: 'Pre-IPO Option Acceleration',
    blurb: 'Clear definition of change of control, single vs double trigger, and early exercise 83(b) tax filing window.',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=720&q=80',
    sampleContract: `STRATA CORE INC. EQUITY COMPENSATION EXHIBIT
1. ACCELERATION: In event of Qualified Acquisition, 50% of unvested options immediately accelerate.
2. SECTION 83(b): Employee has 30 days from exercise to submit IRS Section 83(b) election for favorable capital gains treatment.`,
  },
  {
    id: 'slot-11',
    slotNumber: 'No. 11',
    index: 11,
    world: 'brand',
    worldLabel: 'BRAND',
    worldColor: '#EEF4F6',
    onTextColor: '#0A0E11',
    title: 'Crypto Remittance Tax Trap',
    blurb: 'Requires candidate to receive USDT to personal wallet for secondary conversion, risking tax audit and money laundering penalties.',
    posterUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=720&q=80',
    sampleContract: `DECENTRAL GLOBAL LOGISTICS AGREEMENT
Section 4: Compensation via USDT Smart Contract.
Employee must receive cryptocurrency disbursements in private wallet and facilitate domestic fiat conversion to designated logistics agents. Employee assumes 100% tax and reporting liability.`,
  },
  {
    id: 'slot-12',
    slotNumber: 'No. 12',
    index: 12,
    world: 'learn',
    worldLabel: 'LEARN',
    worldColor: '#9ED8E4',
    onTextColor: '#0E2A3B',
    title: 'Mandatory Binding Arbitration',
    blurb: 'Forced confidential arbitration with class-action waiver, shifting dispute resolution away from public court.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=720&q=80',
    sampleContract: `VANGUARD ENTERPRISE DISPUTE RESOLUTION PROTOCOL
Any controversy or claim arising out of this Agreement shall be settled exclusively by confidential binding arbitration administered by the AAA. Employee explicitly waives any right to trial by jury or participation in class-action proceedings.`,
  },
  {
    id: 'slot-13',
    slotNumber: 'No. 13',
    index: 13,
    world: 'build',
    worldLabel: 'BUILD',
    worldColor: '#3AA8D0',
    onTextColor: '#04121A',
    title: 'Delaware Choice of Law & Venue',
    blurb: 'Standard corporate jurisdiction covenants protecting commercial transactions and intellectual property governance.',
    posterUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=720&q=80',
    sampleContract: `APEX COMMERCIAL VENTURES CORP.
SECTION 14: GOVERNING LAW AND EXCLUSIVE JURISDICTION
This Agreement and all claims arising hereunder shall be construed and enforced exclusively under the laws of the State of Delaware, without regard to conflict of law principles.`,
  },
  {
    id: 'slot-14',
    slotNumber: 'No. 14',
    index: 14,
    world: 'brand',
    worldLabel: 'BRAND',
    worldColor: '#EEF4F6',
    onTextColor: '#0A0E11',
    title: 'Immediate Unvetted Offer Letter',
    blurb: 'High six-figure compensation offered without interviewing references, portfolio inspection, or background checks.',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=720&q=80',
    sampleContract: `EXPEDITED RECRUITMENT CONFIRMATION
Dear Candidate, Due to exceptional high-volume demand on our government cloud contract, we have waived traditional engineering rounds and extend an immediate offer of $180,000/year. Check disbursement begins upon signature.`,
  },
  {
    id: 'slot-15',
    slotNumber: 'No. 15',
    index: 15,
    world: 'learn',
    worldLabel: 'LEARN',
    worldColor: '#9ED8E4',
    onTextColor: '#0E2A3B',
    title: 'Client Confidentiality Firewall',
    blurb: 'Standard NDA and trade secret protection scoped specifically to proprietary source code and client identities.',
    posterUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=720&q=80',
    sampleContract: `NON-DISCLOSURE AND TRADE SECRET COVENANT
Recipient agrees to hold Disclosing Party's proprietary confidential technology and customer lists in confidence, exercising same standard of care used for Recipient's own confidential materials.`,
  },
  {
    id: 'slot-16',
    slotNumber: 'No. 16',
    index: 16,
    world: 'build',
    worldLabel: 'BUILD',
    worldColor: '#3AA8D0',
    onTextColor: '#04121A',
    title: 'Air-Gap PDF Vector Extractor',
    blurb: 'In-browser client-side vector parsing guarantees zero bytes dispatched over network while extracting contract text.',
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=720&q=80',
    sampleContract: `CLAUSEGUARD HYBRID SECURITY ATTESTATION
Client-side PDF Extraction Protocol (#BuildHybridAI 2026)
Zero Network Latency · Zero Remote Storage · On-Device Gemini Nano Sanitization Guaranteed before Cloud Escalation.`,
  },
];
