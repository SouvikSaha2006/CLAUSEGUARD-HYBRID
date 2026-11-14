// ClauseGuard Hybrid - Realistic Preset Contract Test Documents (#BuildHybridAI)

export interface ContractPreset {
  id: string;
  title: string;
  category: 'SCAM_ALERT' | 'PREDATORY_TERMS' | 'CLEAN_STANDARD';
  badge: string;
  description: string;
  expectedRiskScore: number;
  expectedFlags: string[];
  rawText: string;
}

export const PRESET_CONTRACTS: ContractPreset[] = [
  {
    id: 'fake-remote-tech-scam',
    title: 'Fake Remote Tech Offer (Advance-Fee Equipment Scam)',
    category: 'SCAM_ALERT',
    badge: 'High Scam Risk',
    description: 'Advance-fee fake check scam from an illegitimate domain with urgent wire/Zelle demands for home office hardware.',
    expectedRiskScore: 95,
    expectedFlags: [
      'Advance-fee equipment check scam detected',
      'Irrevocable personal wire/Zelle transfer to third-party vendor',
      'Suspicious hiring platform & non-corporate communication channel',
      'Spoofed domain & immediate unvetted job offer'
    ],
    rawText: `APEXCLOUD SOLUTIONS GLOBAL INC.
EMPLOYMENT OFFER & HOME OFFICE ONBOARDING AGREEMENT
CONFIDENTIAL

Date: November 14, 2026
Candidate Name: Alex J. Mercer
Candidate Address: 742 Evergreen Terrace, Austin, TX 78701
Contact Email: alex.mercer.dev@example.net
Phone: +1 (555) 234-8901
Social Security Number / Tax ID: 987-65-4321

Dear Alex,

ApexCloud Solutions Global Inc. ("Company") is pleased to extend an immediate formal offer of employment for the position of Senior Cloud Security Architect (Remote). Following your review of our questionnaire conducted via Telegram messenger (@ApexCloudCareersHR), we were extraordinarily impressed with your qualifications and have waived the traditional technical interviews.

1. COMPENSATION & START DATE
- Title: Senior Cloud Security Architect
- Base Salary: $168,000.00 annually, disbursed bi-weekly via direct deposit.
- Start Date: November 24, 2026.
- Sign-On Bonus: $5,000.00 upon first payroll cycle.

2. AT-WILL EMPLOYMENT
Your employment with the Company is at-will and may be terminated by either party at any time with or without cause.

3. MANDATORY HOME WORKSTATION & HARDWARE SETUP (URGENT)
To ensure compliance with corporate enterprise security firewalls, you are prohibited from utilizing personal laptops. The Company will provide a complete remote workstation package consisting of:
- 1x Apple MacBook Pro M4 Max (64GB RAM)
- 2x UltraFine 4K Displays
- 1x Hardware Security Token & VPN Bridge

4. EQUIPMENT PROCUREMENT PROTOCOL & ADVANCE CHECK
The Company will issue a corporate certified cashier's check in the amount of $4,850.00 payable to Alex J. Mercer. Upon receipt via FedEx, Candidate must immediately:
a) Deposit the cashier's check into your personal bank account via mobile deposit within 12 hours.
b) Once deposited, withdraw the amount of $4,650.00 and immediately transfer it via Zelle, CashApp, or direct domestic wire transfer to our certified approved equipment provider:
   Recipient: Global Hardware Logistics LLC
   Contact: vendor-fulfillment@apexcloud-equipments.com (Telegram: @ApexEquipVendor)
c) Retain $200.00 as an administrative handling allowance.
d) Provide proof of wire transfer receipt. Hardware delivery is guaranteed within 48 hours following confirmation of the wire transfer by the vendor.

WARNING: Failure to execute the vendor wire within 24 hours of check deposit shall result in immediate revocation of this offer and legal referral for breach of contract.

AGREED AND ACCEPTED:

Candidate: Alex J. Mercer
Date: November 14, 2026
SSN: 987-65-4321`
  },
  {
    id: 'predatory-non-compete-ip-trap',
    title: 'Predatory Non-Compete & IP Trap Agreement',
    category: 'PREDATORY_TERMS',
    badge: 'Predatory Legal Terms',
    description: 'Draconian 24-month worldwide non-compete combined with an all-encompassing IP grab over personal projects and side work.',
    expectedRiskScore: 82,
    expectedFlags: [
      'Worldwide 24-month broad Non-Compete restriction',
      'Total Intellectual Property grab (including personal time & prior inventions)',
      'Unilateral $250,000 liquidated damages clause',
      'Overbroad unilateral indemnification requirement'
    ],
    rawText: `OMNICORP DYNAMIC SYSTEMS LLC
PROPRIETARY INFORMATION, INVENTIONS ASSIGNMENT, AND RESTRICTIVE COVENANTS AGREEMENT

This Agreement is entered into between OmniCorp Dynamic Systems LLC ("Company") and Jordan Taylor ("Employee").
Employee Contact: jordan.taylor.dev@example.com | Phone: (555) 890-1234
Address: 100 Main Street, Apt 4B, Seattle, WA 98101
Social Security Number: 456-78-9012
Position: Principal Software Architect
Base Salary: $195,000 per year

In consideration of employment, the parties agree to the following binding covenants:

SECTION 1: COMPREHENSIVE INTELLECTUAL PROPERTY & INVENTIONS ASSIGNMENT
Employee agrees that all ideas, inventions, discoveries, software code, repositories, algorithms, models, formulas, and copyrightable works created, conceived, reduced to practice, or developed by Employee—whether during working hours or outside working hours, whether utilizing Company resources or personal equipment, whether prior to or during the term of employment, and whether related or completely unrelated to Company's current or prospective business—shall be the sole and exclusive property of OmniCorp Dynamic Systems LLC throughout the universe in perpetuity. Employee hereby irrevocably assigns all rights, titles, and interests in any personal open-source projects, side ventures, or hobbies to Company without additional royalty or consideration.

SECTION 2: WORLDWIDE NON-COMPETE RESTRICTION
For a period of twenty-four (24) months following termination of employment for any reason (voluntary or involuntary):
Employee shall not directly or indirectly engage in, perform services for, consult with, advise, invest in, or be employed by any business, enterprise, or entity anywhere in the world that operates in the software, artificial intelligence, cloud infrastructure, or internet services sectors, or in any industry that OmniCorp may enter or plans to enter.

SECTION 3: LIQUIDATED DAMAGES & ATTORNEY INDEMNIFICATION
Employee acknowledges that any breach of Section 1 or Section 2 would cause irreparable harm to Company. Employee explicitly agrees that in the event of any alleged breach, Employee shall pay to Company the fixed sum of $250,000.00 as liquidated damages per violation, in addition to paying all legal fees and court costs incurred by Company. Furthermore, Employee shall unconditionally indemnify and hold harmless Company from any third-party claims arising from Employee's conduct.

SECTION 4: GOVERNING LAW & JURISDICTION
This Agreement shall be governed exclusively by the laws of Delaware. Employee waives all rights to a jury trial and agrees to submit all claims to binding arbitration at Company's sole discretion.

ACCEPTED AND SIGNED:
Employee: Jordan Taylor
Date: November 14, 2026
SSN: 456-78-9012`
  },
  {
    id: 'clean-standard-offer',
    title: 'Clean Standard Engineering Offer',
    category: 'CLEAN_STANDARD',
    badge: 'Clean / Safe',
    description: 'Standard, fair employment offer with reasonable IP protection, no non-compete, and direct corporate equipment shipping.',
    expectedRiskScore: 12,
    expectedFlags: [
      'Standard fair employment terms',
      'Balanced IP assignment restricted to company scope and company hours',
      'No restrictive non-compete clause',
      'Standard direct company-provided hardware and benefits'
    ],
    rawText: `BEACON OPEN TECHNOLOGIES, PBC
EMPLOYMENT OFFER LETTER

Date: November 14, 2026
Candidate: Morgan Lee
Address: 500 Market Street, Suite 400, San Francisco, CA 94105
Email: morgan.lee@techmail.org
Phone: +1 (555) 345-6789
ID Reference: EMP-2026-9811

Dear Morgan,

On behalf of Beacon Open Technologies, PBC ("Beacon"), we are delighted to offer you the position of Senior Full-Stack Engineer on our Core Platform team.

1. POSITION AND RESPONSIBILITIES
You will report to the VP of Engineering. This is a full-time, exempt remote position based in the United States.

2. COMPENSATION & BENEFITS
- Base Compensation: $160,000.00 annually, paid semi-monthly in accordance with standard payroll schedules.
- Equity Incentive: Stock option grant of 15,000 shares of Common Stock, subject to 4-year vesting with a 1-year cliff.
- Health & Wellness: Comprehensive medical, dental, and vision insurance coverage (100% employer-covered premiums).
- Retirement: 401(k) retirement savings plan with a 4% dollar-for-dollar company match.
- Paid Time Off: Flexible PTO policy with a recommended minimum of 20 days annually.

3. HARDWARE & EXPENSES
Beacon will ship a pre-configured corporate laptop (Apple MacBook Pro M3) and peripheral kit directly to your home address at zero cost to you. An annual $1,000 home office stipend will be reimbursed via payroll expenses.

4. INTELLECTUAL PROPERTY & PROPRIETARY INFORMATION
You agree to assign to Beacon all rights in inventions, software, and works of authorship created within the scope of your employment with Beacon, during working hours, or using Company confidential materials. You retain 100% ownership of your pre-existing inventions and any independent personal projects created entirely on your own time without using Beacon assets or proprietary confidential data (as itemized in Exhibit A).

5. RESTRICTIVE COVENANTS
Beacon respects employee career mobility. This agreement contains NO post-employment non-compete clause. You agree to reasonable 1-year non-solicitation of Beacon employees and clients, and standard perpetual confidentiality regarding proprietary trade secrets.

We look forward to welcoming you to the Beacon Open Technologies team!

Sincerely,
Elena Vance
Chief Executive Officer, Beacon Open Technologies, PBC

ACCEPTED AND AGREED:
Morgan Lee
Date: November 14, 2026`
  }
];
