// ClauseGuard Hybrid (#BuildHybridAI 2026)
// Sea Ring Atmospheric Architecture, Opening Sequence & Zero-Trust Contract Firewall

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useClauseGuard } from './hooks/useClauseGuard';
import { PRESET_CONTRACTS } from './data/presets';
import './styles/seaRing.css';

// 16 Threat & Guardrail Ring Cards with dedicated poster images
export interface RingCard {
  id: string;
  presetId?: string;
  index: string;
  title: string;
  badge: string;
  badgeType: 'critical' | 'predatory' | 'clean';
  riskScore: number;
  description: string;
  posterUrl: string;
  sampleText?: string;
}

const RING_CARDS: RingCard[] = [
  {
    id: 'card-1',
    presetId: 'fake-remote-tech-scam',
    index: 'THREAT #01',
    title: 'Advance-Fee Hardware Scam',
    badge: 'Critical Scam Alert',
    badgeType: 'critical',
    riskScore: 95,
    description: 'Counterfeit cashier check scam with urgent wire/Zelle transfer demands to a fictitious approved hardware vendor.',
    posterUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-2',
    presetId: 'predatory-non-compete-ip-trap',
    index: 'THREAT #02',
    title: '24-Month Worldwide Non-Compete',
    badge: 'Predatory Terms',
    badgeType: 'predatory',
    riskScore: 82,
    description: 'Draconian two-year worldwide employment restraint combined with an all-encompassing moonlighting IP grab.',
    posterUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-3',
    presetId: 'clean-standard-offer',
    index: 'STANDARD #03',
    title: 'Clean Engineering Offer',
    badge: 'Clean / Safe',
    badgeType: 'clean',
    riskScore: 12,
    description: 'Fair employment terms with balanced IP protection, no non-compete, and direct corporate equipment shipping.',
    posterUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-4',
    index: 'THREAT #04',
    title: 'Liquidated Damages Gag ($250k)',
    badge: 'Predatory Terms',
    badgeType: 'predatory',
    riskScore: 88,
    description: 'Unilateral $250,000 liquidated damages clause combined with immediate attorney fee shifting on any perceived breach.',
    posterUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-5',
    index: 'THREAT #05',
    title: 'Universal Moonlight IP Expropriation',
    badge: 'Predatory Terms',
    badgeType: 'predatory',
    riskScore: 91,
    description: 'Expropriates all personal open-source projects, weekend creations, and prior inventions throughout the universe in perpetuity.',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-6',
    index: 'THREAT #06',
    title: 'Telegram Messenger Interview Trap',
    badge: 'Critical Scam Alert',
    badgeType: 'critical',
    riskScore: 98,
    description: 'Unverified Telegram questionnaire interview with waived technical steps and spoofed domain correspondence.',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-7',
    index: 'THREAT #07',
    title: 'Mandatory Binding Arbitration Waiver',
    badge: 'Predatory Terms',
    badgeType: 'predatory',
    riskScore: 74,
    description: 'Complete waiver of jury trial, class-action remedies, and appeal rights, forced into employer-selected private forum.',
    posterUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-8',
    index: 'THREAT #08',
    title: 'Uncapped Third-Party Indemnification',
    badge: 'Predatory Terms',
    badgeType: 'predatory',
    riskScore: 85,
    description: 'Forces candidate to unconditionally indemnify company against any third-party claims or operational liabilities.',
    posterUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-9',
    index: 'THREAT #09',
    title: 'Offshore Crypto Remittance Scheme',
    badge: 'Critical Scam Alert',
    badgeType: 'critical',
    riskScore: 94,
    description: 'Requires candidate to receive USDT/Bitcoin for secondary domestic forwarding, exposing applicant to money laundering liability.',
    posterUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-10',
    index: 'THREAT #10',
    title: 'Cliff Equity Forfeiture Clawback',
    badge: 'Predatory Terms',
    badgeType: 'predatory',
    riskScore: 78,
    description: 'Unilateral equity cancellation upon termination without cause, revoking all vested and accrued stock grants.',
    posterUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-11',
    index: 'GUARDRAIL #11',
    title: 'Gemini Nano On-Device Redaction',
    badge: 'Air-Gap Shield',
    badgeType: 'clean',
    riskScore: 4,
    description: 'Strict client-side air-gap sanitization of candidate names, SSNs, compensation, addresses, and contacts in zero network ms.',
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-12',
    index: 'GUARDRAIL #12',
    title: 'Firebase AI Logic Hybrid Router',
    badge: 'Dual-Stage Core',
    badgeType: 'clean',
    riskScore: 5,
    description: 'Seamlessly orchestrates on-device inference with cloud Gemini 2.5 Flash escalation while enforcing zero PII leakage.',
    posterUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-13',
    index: 'GUARDRAIL #13',
    title: 'Firebase App Check Attestation',
    badge: 'Zero-Trust Auth',
    badgeType: 'clean',
    riskScore: 3,
    description: 'ReCAPTCHA v3 cryptographic app verification shielding all backend endpoints from automated replay and abuse.',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-14',
    index: 'GUARDRAIL #14',
    title: 'Remote Config Realtime Throttling',
    badge: 'Dynamic Threshold',
    badgeType: 'clean',
    riskScore: 6,
    description: 'Dynamically shifts escalation score thresholds and routing modes across millions of clients in real time without redeploying.',
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-15',
    index: 'GUARDRAIL #15',
    title: '100% In-Browser PDF Vector Parser',
    badge: 'Sandbox Extractor',
    badgeType: 'clean',
    riskScore: 2,
    description: 'Client-side vector stream extraction of contract PDF files directly in browser memory with zero bytes dispatched.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'card-16',
    index: 'GUARDRAIL #16',
    title: 'Automated Counter-Offer Synthesizer',
    badge: 'Legal Shield',
    badgeType: 'clean',
    riskScore: 7,
    description: 'Generates professional, diplomatic counter-offers proposing reasonable 6-month non-competes and moonlighting carve-outs.',
    posterUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
];

// 12 Back Petals configuration
interface PetalConfig {
  id: number;
  top: string;
  left: string;
  width: string;
  height: string;
  duration: string;
  delay: string;
  opacity: number;
  animationName: string;
}

const BACK_PETALS: PetalConfig[] = [
  { id: 1, top: '16%', left: '8%', width: '22px', height: '14px', duration: '12s', delay: '0s', opacity: 0.45, animationName: 'floatSwayA' },
  { id: 2, top: '28%', left: '22%', width: '18px', height: '12px', duration: '14s', delay: '-2s', opacity: 0.55, animationName: 'floatSwayB' },
  { id: 3, top: '14%', left: '44%', width: '24px', height: '16px', duration: '16s', delay: '-5s', opacity: 0.4, animationName: 'floatSwayA' },
  { id: 4, top: '35%', left: '60%', width: '20px', height: '13px', duration: '13s', delay: '-1.5s', opacity: 0.5, animationName: 'floatSwayB' },
  { id: 5, top: '22%', left: '82%', width: '26px', height: '17px', duration: '15s', delay: '-4s', opacity: 0.35, animationName: 'floatSwayA' },
  { id: 6, top: '48%', left: '12%', width: '16px', height: '10px', duration: '11s', delay: '-3s', opacity: 0.6, animationName: 'floatSwayB' },
  { id: 7, top: '56%', left: '34%', width: '22px', height: '14px', duration: '17s', delay: '-6s', opacity: 0.45, animationName: 'floatSwayA' },
  { id: 8, top: '42%', left: '76%', width: '19px', height: '12px', duration: '14.5s', delay: '-7s', opacity: 0.5, animationName: 'floatSwayB' },
  { id: 9, top: '65%', left: '86%', width: '25px', height: '15px', duration: '12.5s', delay: '-2.5s', opacity: 0.4, animationName: 'floatSwayA' },
  { id: 10, top: '62%', left: '52%', width: '17px', height: '11px', duration: '15.5s', delay: '-8s', opacity: 0.55, animationName: 'floatSwayB' },
  { id: 11, top: '72%', left: '24%', width: '21px', height: '13px', duration: '13.5s', delay: '-4.5s', opacity: 0.42, animationName: 'floatSwayA' },
  { id: 12, top: '78%', left: '66%', width: '23px', height: '15px', duration: '16.5s', delay: '-9s', opacity: 0.38, animationName: 'floatSwayB' },
];

// 5 Front Petals configuration
const FRONT_PETALS: PetalConfig[] = [
  { id: 1, top: '24%', left: '14%', width: '38px', height: '24px', duration: '8.5s', delay: '-1s', opacity: 0.85, animationName: 'floatSwayA' },
  { id: 2, top: '68%', left: '16%', width: '44px', height: '28px', duration: '9.2s', delay: '-3.5s', opacity: 0.78, animationName: 'floatSwayB' },
  { id: 3, top: '32%', left: '84%', width: '42px', height: '26px', duration: '10s', delay: '-2s', opacity: 0.82, animationName: 'floatSwayA' },
  { id: 4, top: '76%', left: '78%', width: '48px', height: '30px', duration: '8.8s', delay: '-5s', opacity: 0.75, animationName: 'floatSwayB' },
  { id: 5, top: '82%', left: '46%', width: '36px', height: '22px', duration: '9.5s', delay: '-4s', opacity: 0.88, animationName: 'floatSwayA' },
];

// 14 Glowing Motes configuration
interface MoteConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
}

const GLOWING_MOTES: MoteConfig[] = [
  { id: 1, top: '15%', left: '18%', size: 4, duration: '4.5s', delay: '0s' },
  { id: 2, top: '26%', left: '32%', size: 6, duration: '5.8s', delay: '-1.5s' },
  { id: 3, top: '18%', left: '62%', size: 5, duration: '6.2s', delay: '-3s' },
  { id: 4, top: '34%', left: '80%', size: 3, duration: '4.8s', delay: '-2.1s' },
  { id: 5, top: '48%', left: '22%', size: 5, duration: '5.2s', delay: '-4s' },
  { id: 6, top: '58%', left: '42%', size: 7, duration: '7.1s', delay: '-0.8s' },
  { id: 7, top: '44%', left: '70%', size: 4, duration: '4.9s', delay: '-2.7s' },
  { id: 8, top: '68%', left: '88%', size: 6, duration: '6.5s', delay: '-5.2s' },
  { id: 9, top: '75%', left: '15%', size: 4, duration: '5.4s', delay: '-1.8s' },
  { id: 10, top: '82%', left: '35%', size: 5, duration: '6.0s', delay: '-3.6s' },
  { id: 11, top: '78%', left: '58%', size: 6, duration: '5.7s', delay: '-4.4s' },
  { id: 12, top: '88%', left: '74%', size: 3, duration: '4.6s', delay: '-1.2s' },
  { id: 13, top: '38%', left: '50%', size: 5, duration: '6.8s', delay: '-2.5s' },
  { id: 14, top: '52%', left: '92%', size: 4, duration: '5.1s', delay: '-3.8s' },
];

const SEA_STILL_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_224417_17e8d78c-9384-4a50-93b4-92510f1957db.png&w=2048&q=85';

const SEA_LOOP_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261111_232613_bf108dd9-dc98-4729-9163-748475f20b61.mp4';

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

  // Navigation & View State ('home' = FIREWALL, 'build' = AUDIT LAB)
  const [currentView, setCurrentView] = useState<'home' | 'build'>(() => {
    return window.location.hash === '#build' ? 'build' : 'home';
  });

  // Opening Sequence State ('idle' | 'running' | 'revealing' | 'completed')
  const [introState, setIntroState] = useState<'running' | 'revealing' | 'completed'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#build') return 'completed';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'completed';
    }
    return 'running';
  });

  // Typewriter Caption
  const [typewriterText, setTypewriterText] = useState<string>('');
  const fullCaption = 'INITIALIZING HYBRID ENGINE';

  // 3-digit Odometer progress (0..100)
  const [odometerValue, setOdometerValue] = useState<number>(0);
  const targetProgressRef = useRef<number>(0);

  // Flying wordmark coordinates
  const [flyingStyle, setFlyingStyle] = useState<React.CSSProperties | null>(null);
  const [flyingDotFaded, setFlyingDotFaded] = useState(false);
  const [navWordmarkVisible, setNavWordmarkVisible] = useState(false);

  // Elements refs for measurements
  const loaderClauseRef = useRef<HTMLHeadingElement | null>(null);
  const navWordmarkRef = useRef<HTMLSpanElement | null>(null);
  const videoHomeRef = useRef<HTMLVideoElement | null>(null);
  const videoBuildRef = useRef<HTMLVideoElement | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Copy status feedback for counter-offer draft
  const [copiedDraft, setCopiedDraft] = useState(false);

  // 3D Ring carousel state
  const [ringRotation, setRingRotation] = useState<number>(0);
  const [isDraggingRing, setIsDraggingRing] = useState<boolean>(false);
  const ringDragStartX = useRef<number>(0);
  const ringStartRot = useRef<number>(0);
  const ringVelocity = useRef<number>(0);

  // Spring Parallax State (pointer coordinates & spring simulation)
  const [parallaxOffset, setParallaxOffset] = useState({
    sceneX: 0, sceneY: 0,
    backPetalsX: 0, backPetalsY: 0,
    mistX: 0, mistY: 0,
    motesX: 0, motesY: 0,
    frontPetalsX: 0, frontPetalsY: 0,
  });

  // Spring physics variables: stiffness: 40, damping: 18, mass: 1
  const targetPointerRef = useRef({ x: 0, y: 0 });
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const velocityPointerRef = useRef({ x: 0, y: 0 });

  // 1. Sync URL hash with current view
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#build') {
        setCurrentView('build');
        document.body.classList.remove('view-home-locked');
      } else {
        setCurrentView('home');
        document.body.classList.add('view-home-locked');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // 2. Manage Home View Body Scroll Lock
  useEffect(() => {
    if (currentView === 'home' && introState !== 'running') {
      document.body.classList.add('view-home-locked');
    } else {
      document.body.classList.remove('view-home-locked');
    }
  }, [currentView, introState]);

  // 3. Skip Opening Sequence Helper
  const triggerReveal = useCallback(() => {
    if (introState === 'completed') return;

    setIntroState('revealing');

    // Measure positions for "Clause." flight to .wmFirst in navbar
    if (loaderClauseRef.current && navWordmarkRef.current) {
      const loaderEl = loaderClauseRef.current;
      const navEl = navWordmarkRef.current;
      const startRect = loaderEl.getBoundingClientRect();
      const targetRect = navEl.getBoundingClientRect();

      const deltaX = targetRect.left - startRect.left;
      const deltaY = targetRect.top - startRect.top;
      const scale = targetRect.width > 0 && startRect.width > 0 ? targetRect.width / startRect.width : 0.35;
      const initialFontSize = window.getComputedStyle(loaderEl).fontSize;

      setFlyingStyle({
        top: `${startRect.top}px`,
        left: `${startRect.left}px`,
        fontSize: initialFontSize,
        transform: 'translate3d(0, 0, 0) scale(1)',
        opacity: 1,
      });

      // Trigger animation frame for CSS transition
      requestAnimationFrame(() => {
        setFlyingStyle({
          top: `${startRect.top}px`,
          left: `${startRect.left}px`,
          fontSize: initialFontSize,
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scale})`,
          opacity: 1,
        });
        setFlyingDotFaded(true);
      });
    }

    // Flight completes after 1.3s
    setTimeout(() => {
      setNavWordmarkVisible(true);
      setFlyingStyle(null);
      setIntroState('completed');
    }, 1300);
  }, [introState]);

  // 4. Preload 16 Card Posters & Odometer Progression with 9s failsafe
  useEffect(() => {
    if (introState !== 'running') return;

    let loadedCount = 0;
    const totalAssets = RING_CARDS.length;

    // Preload each card image
    RING_CARDS.forEach((card) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount += 1;
        targetProgressRef.current = Math.min(100, Math.round((loadedCount / totalAssets) * 100));
      };
      img.src = card.posterUrl;
    });

    // Also preload the Sea Still image
    const seaImg = new Image();
    seaImg.src = SEA_STILL_URL;

    // Smooth odometer interpolation loop
    const odoInterval = setInterval(() => {
      setOdometerValue((prev) => {
        const target = targetProgressRef.current;
        if (prev < target) {
          const next = Math.min(target, prev + Math.max(1, Math.floor((target - prev) / 3)));
          return next;
        }
        return prev;
      });
    }, 45);

    // 9s failsafe timeout
    const failsafeTimeout = setTimeout(() => {
      targetProgressRef.current = 100;
      setOdometerValue(100);
      setTimeout(() => {
        triggerReveal();
      }, 350);
    }, 9000);

    return () => {
      clearInterval(odoInterval);
      clearTimeout(failsafeTimeout);
    };
  }, [introState, triggerReveal]);

  // Trigger reveal when odometer reaches 100
  useEffect(() => {
    if (introState === 'running' && odometerValue >= 100) {
      const timer = setTimeout(() => {
        triggerReveal();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [odometerValue, introState, triggerReveal]);

  // 5. Typewriter Caption starting at 350ms, 45ms/char
  useEffect(() => {
    if (introState !== 'running') return;

    const startTimeout = setTimeout(() => {
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx += 1;
        setTypewriterText(fullCaption.slice(0, charIdx));
        if (charIdx >= fullCaption.length) {
          clearInterval(typeInterval);
        }
      }, 45);

      return () => clearInterval(typeInterval);
    }, 350);

    return () => clearTimeout(startTimeout);
  }, [introState]);

  // 6. Keyboard Skip listener (Escape, Tab)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        if (introState === 'running') {
          e.preventDefault();
          targetProgressRef.current = 100;
          setOdometerValue(100);
          triggerReveal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introState, triggerReveal]);

  // 7. Video visibility playback control
  useEffect(() => {
    const vid = currentView === 'home' ? videoHomeRef.current : videoBuildRef.current;
    if (vid) {
      vid.play().catch(() => {});
    }
  }, [currentView]);

  // 8. Fine-pointer Spring Parallax Loop
  // Stiffness: 40, Damping: 18, Mass: 1
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetPointerRef.current = {
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let lastTime = performance.now();
    let animId: number;

    const springLoop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const k = 40;  // stiffness
      const d = 18;  // damping
      const m = 1;   // mass

      // Spring X
      const fx = -k * (currentPointerRef.current.x - targetPointerRef.current.x) - d * velocityPointerRef.current.x;
      const ax = fx / m;
      velocityPointerRef.current.x += ax * dt;
      currentPointerRef.current.x += velocityPointerRef.current.x * dt;

      // Spring Y
      const fy = -k * (currentPointerRef.current.y - targetPointerRef.current.y) - d * velocityPointerRef.current.y;
      const ay = fy / m;
      velocityPointerRef.current.y += ay * dt;
      currentPointerRef.current.y += velocityPointerRef.current.y * dt;

      const px = currentPointerRef.current.x;
      const py = currentPointerRef.current.y;

      // Depths: scene: 10, back petals: 22, mist: 34, motes: 40, front petals: 48
      setParallaxOffset({
        sceneX: px * 10, sceneY: py * 10,
        backPetalsX: px * 22, backPetalsY: py * 22,
        mistX: px * 34, mistY: py * 34,
        motesX: px * 40, motesY: py * 40,
        frontPetalsX: px * 48, frontPetalsY: py * 48,
      });

      animId = requestAnimationFrame(springLoop);
    };

    animId = requestAnimationFrame(springLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 9. 3D Ring drag and momentum loop
  useEffect(() => {
    let animId: number;
    const momentumLoop = () => {
      if (!isDraggingRing) {
        if (Math.abs(ringVelocity.current) > 0.01) {
          setRingRotation((prev) => prev + ringVelocity.current);
          ringVelocity.current *= 0.94; // friction
        } else {
          // Subtle idle ambient spin
          setRingRotation((prev) => prev - 0.035);
        }
      }
      animId = requestAnimationFrame(momentumLoop);
    };

    animId = requestAnimationFrame(momentumLoop);
    return () => cancelAnimationFrame(animId);
  }, [isDraggingRing]);

  const handleRingPointerDown = (e: React.PointerEvent) => {
    setIsDraggingRing(true);
    ringDragStartX.current = e.clientX;
    ringStartRot.current = ringRotation;
    ringVelocity.current = 0;
  };

  const handleRingPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRing) return;
    const delta = e.clientX - ringDragStartX.current;
    const newRot = ringStartRot.current + delta * 0.28;
    ringVelocity.current = delta * 0.04;
    setRingRotation(newRot);
  };

  const handleRingPointerUp = () => {
    setIsDraggingRing(false);
  };

  // Card select -> Load into Audit Lab & Switch View
  const handleSelectCard = (card: RingCard) => {
    if (card.presetId) {
      loadPreset(card.presetId);
    } else if (card.sampleText) {
      setRawContractText(card.sampleText);
    }
    window.location.hash = '#build';
    setCurrentView('build');
  };

  // Handle PDF Upload
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadPdf(file);
    }
  };

  // Copy counter-offer draft helper
  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Format 3-digit odometer string (e.g. 000, 042, 100)
  const odoString = String(odometerValue).padStart(3, '0');

  // Letter delays for Clause.
  const letterDelays = [0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.58];

  return (
    <>
      {/* =====================================================================
          1. NAV BAR
          ===================================================================== */}
      <nav className="sea-nav" aria-label="Main Navigation">
        {/* Left wordmark */}
        <a
          href="#home"
          className="sea-nav-brand"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '#home';
            setCurrentView('home');
          }}
        >
          <span
            ref={navWordmarkRef}
            className="wmFirst"
            style={{ opacity: navWordmarkVisible || introState === 'completed' ? 1 : 0 }}
          >
            Clause
          </span>
          <span className="wmRest">&nbsp;Guard.</span>
        </a>

        {/* Right Links & Firebase Live Status Pill */}
        <div className="sea-nav-right">
          {/* Subtle live Firebase AI Logic status pill */}
          <div className="sea-nav-status-pill" title="Firebase AI Logic On-Device & Remote Config Status">
            <span
              className={`sea-status-indicator ${
                nanoStatus === 'ready'
                  ? 'ready'
                  : nanoStatus === 'downloading'
                  ? 'downloading'
                  : 'unavailable'
              }`}
            />
            <span>NANO: {nanoStatus}</span>
            <span className="sea-nav-sep">/</span>
            <span>MODE: {remoteConfigValues.routing_mode}</span>
          </div>

          <div className="sea-nav-links">
            <a
              href="#home"
              className={`sea-nav-link ${currentView === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#home';
                setCurrentView('home');
              }}
            >
              FIREWALL
            </a>
            <span className="sea-nav-sep">/</span>
            <a
              href="#build"
              className={`sea-nav-link ${currentView === 'build' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#build';
                setCurrentView('build');
              }}
            >
              AUDIT LAB
            </a>
          </div>
        </div>
      </nav>

      {/* =====================================================================
          2. FULL-SCREEN OPENING SEQUENCE
          ===================================================================== */}
      {introState !== 'completed' && (
        <div
          className={`sea-loader-overlay ${
            introState === 'running' ? 'animating' : introState === 'revealing' ? 'closing hidden' : 'hidden'
          }`}
        >
          {/* Top-left rising letter mask: "Clause." */}
          <h1 ref={loaderClauseRef} className="sea-loader-title">
            {'Clause.'.split('').map((char, i) => (
              <span key={i} className="sea-char-mask">
                <span
                  className="sea-char-inner"
                  style={{ transitionDelay: `${letterDelays[i]}s` }}
                >
                  {char}
                </span>
              </span>
            ))}
          </h1>

          {/* Bottom-right typewriter & 3-digit vertical-sliding odometer */}
          <div className="sea-loader-bottom-right">
            <span className="sea-typewriter-caption">{typewriterText}</span>
            <div className="sea-odometer-mask">
              <div className="sea-odometer-digits">{odoString}</div>
            </div>
          </div>

          {/* Bottom-left skip button "↗" */}
          <button
            type="button"
            className="sea-skip-btn"
            title="Skip sequence (Esc / Tab)"
            onClick={triggerReveal}
          >
            ↗
          </button>
        </div>
      )}

      {/* Flying "Clause." animation clone */}
      {flyingStyle && (
        <div className="sea-flying-wordmark" style={flyingStyle}>
          <span>Clause</span>
          <span className={`sea-flying-dot ${flyingDotFaded ? 'fade' : ''}`}>.</span>
        </div>
      )}

      {/* =====================================================================
          3. VIEW: HOME (#view-home) - 3D SEA RING EXPERIENCE
          ===================================================================== */}
      <div
        id="view-home"
        style={{ display: currentView === 'home' ? 'block' : 'none' }}
      >
        <div className={`sea-world-frame ${introState !== 'running' ? 'revealed' : ''}`}>
          <div className="sea-frame-inner">
            {/* Scene Image & Loop Video */}
            <div
              className={`sea-scene-layer ${introState !== 'running' ? 'visible' : ''}`}
              style={{
                transform: `translate3d(${parallaxOffset.sceneX}px, ${parallaxOffset.sceneY}px, 0)`,
              }}
            >
              <img
                src={SEA_STILL_URL}
                alt="Sunlit Sea Stage"
                className="sea-scene-media"
              />
              <video
                ref={videoHomeRef}
                src={SEA_LOOP_VIDEO_URL}
                className={`sea-scene-media sea-scene-video ${videoPlaying ? 'playing' : ''}`}
                muted
                loop
                playsInline
                autoPlay
                onPlaying={() => setVideoPlaying(true)}
              />
            </div>

            {/* Jittering Grain Layer */}
            <div className="sea-grain-layer" />

            {/* 12 Back Petals */}
            <div
              className="sea-petals-back-layer"
              style={{
                transform: `translate3d(${parallaxOffset.backPetalsX}px, ${parallaxOffset.backPetalsY}px, 0)`,
              }}
            >
              {BACK_PETALS.map((petal) => (
                <div
                  key={petal.id}
                  className="sea-petal"
                  style={{
                    top: petal.top,
                    left: petal.left,
                    width: petal.width,
                    height: petal.height,
                    opacity: petal.opacity,
                    animation: `${petal.animationName} ${petal.duration} ease-in-out infinite alternate`,
                    animationDelay: petal.delay,
                  }}
                />
              ))}
            </div>

            {/* 3D Ring Container (z: 2) */}
            <div
              className="sea-ring-stage"
              onPointerDown={handleRingPointerDown}
              onPointerMove={handleRingPointerMove}
              onPointerUp={handleRingPointerUp}
              onPointerCancel={handleRingPointerUp}
            >
              <div
                className="sea-ring-carousel"
                style={{
                  transform: `rotateY(${ringRotation}deg)`,
                }}
              >
                {RING_CARDS.map((card, i) => {
                  const angle = (360 / RING_CARDS.length) * i;
                  const radius = 700; // cylinder radius in px

                  return (
                    <div
                      key={card.id}
                      className="sea-ring-card"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      }}
                      onClick={() => handleSelectCard(card)}
                    >
                      <div className="sea-card-header">
                        <span className={`sea-card-badge ${card.badgeType}`}>
                          {card.badge}
                        </span>
                        <span className="sea-card-risk-pill">
                          RISK {card.riskScore}
                        </span>
                      </div>

                      <div className="sea-card-body">
                        <div className="sea-card-index">{card.index}</div>
                        <h3 className="sea-card-title">{card.title}</h3>
                        <p className="sea-card-desc">{card.description}</p>
                      </div>

                      <div className="sea-card-footer">
                        <button type="button" className="sea-card-btn">
                          Audit in Lab <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom White Mist Layer (height: 46%) */}
            <div
              className={`sea-mist-layer ${introState !== 'running' ? 'risen' : ''}`}
              style={{
                transform: `translate3d(${parallaxOffset.mistX}px, ${parallaxOffset.mistY}px, 0)`,
              }}
            />

            {/* 5 Front Petals (z: 3) */}
            <div
              className="sea-petals-front-layer"
              style={{
                transform: `translate3d(${parallaxOffset.frontPetalsX}px, ${parallaxOffset.frontPetalsY}px, 0)`,
              }}
            >
              {FRONT_PETALS.map((petal) => (
                <div
                  key={petal.id}
                  className="sea-petal"
                  style={{
                    top: petal.top,
                    left: petal.left,
                    width: petal.width,
                    height: petal.height,
                    opacity: petal.opacity,
                    filter: 'drop-shadow(0 0 6px rgba(158, 216, 228, 0.4))',
                    animation: `${petal.animationName} ${petal.duration} ease-in-out infinite alternate`,
                    animationDelay: petal.delay,
                  }}
                />
              ))}
            </div>

            {/* 14 Glowing Motes (z: 4) */}
            <div
              className="sea-motes-layer"
              style={{
                transform: `translate3d(${parallaxOffset.motesX}px, ${parallaxOffset.motesY}px, 0)`,
              }}
            >
              {GLOWING_MOTES.map((mote) => (
                <div
                  key={mote.id}
                  className="sea-mote"
                  style={{
                    top: mote.top,
                    left: mote.left,
                    width: `${mote.size}px`,
                    height: `${mote.size}px`,
                    animation: `motePulse ${mote.duration} ease-in-out infinite`,
                    animationDelay: mote.delay,
                  }}
                />
              ))}
            </div>

            {/* Center Hero Heading & Actions */}
            <div className="sea-home-hero">
              <span className="sea-hero-kicker">#BuildHybridAI 2026</span>
              <h1 className="sea-hero-title">Zero-Trust AI Contract Firewall</h1>
              <p className="sea-hero-subtitle">
                Air-gapped on-device Gemini Nano redaction stops scam clauses and PII leaks before intelligent escalation to Gemini 2.5 Flash in Firebase.
              </p>
              <div className="sea-hero-actions">
                <button
                  type="button"
                  className="sea-btn-primary"
                  onClick={() => {
                    window.location.hash = '#build';
                    setCurrentView('build');
                  }}
                >
                  Open Audit Lab →
                </button>
                <button
                  type="button"
                  className="sea-btn-secondary"
                  onClick={() => {
                    setRingRotation((prev) => prev + 45);
                  }}
                >
                  Spin 16 Threat Cards ↻
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. VIEW: AUDIT LAB (#view-build)
          ===================================================================== */}
      <div
        id="view-build"
        className="sea-audit-lab-view"
        style={{ display: currentView === 'build' ? 'block' : 'none' }}
      >
        {/* Ambient Sea Background for Audit Lab */}
        <div className="sea-lab-backdrop-container">
          <img
            src={SEA_STILL_URL}
            alt="Sea Atmosphere Backdrop"
            className="sea-scene-media"
          />
          <video
            ref={videoBuildRef}
            src={SEA_LOOP_VIDEO_URL}
            className={`sea-scene-media sea-scene-video ${videoPlaying ? 'playing' : ''}`}
            muted
            loop
            playsInline
            autoPlay
          />
          <div className="sea-lab-backdrop-overlay" />
        </div>

        <div className="sea-lab-container">
          {/* Top Engine & Remote Config Control Bar */}
          <div className="sea-engine-bar">
            <div className="sea-engine-status-group">
              <div className="sea-engine-chip">
                <span
                  className={`sea-status-indicator ${
                    nanoStatus === 'ready'
                      ? 'ready'
                      : nanoStatus === 'downloading'
                      ? 'downloading'
                      : 'unavailable'
                  }`}
                />
                <span>Gemini Nano: <strong>{nanoStatus.toUpperCase()}</strong></span>
                <button
                  type="button"
                  className="sea-btn-mini"
                  onClick={() => refreshNanoStatus()}
                >
                  Check Nano
                </button>
              </div>

              <div className="sea-engine-chip">
                <span>Routing Mode: <strong>{remoteConfigValues.routing_mode}</strong></span>
                <span className="sea-nav-sep">|</span>
                <span>Threshold: <strong>{remoteConfigValues.cloud_escalation_threshold}</strong></span>
                <button
                  type="button"
                  className="sea-btn-mini"
                  onClick={() => refreshRemoteConfig()}
                >
                  Fetch Remote Config
                </button>
              </div>
            </div>

            <div>
              <span className="sea-card-step-tag">Zero PII Leakage Guarantee</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="sea-error-banner">
              <strong>Engine Alert:</strong> {error}
            </div>
          )}

          {/* Main Grid: Inputs (Left) and Results (Right) */}
          <div className="sea-lab-grid">
            {/* LEFT COLUMN: Ingestion, Presets, and Raw Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Presets & PDF Ingestion */}
              <div className="sea-glass-card">
                <div className="sea-card-section-title">
                  <h2>Contract Ingestion & Presets</h2>
                  <span className="sea-card-step-tag">Step 1</span>
                </div>

                <div className="sea-presets-list">
                  {PRESET_CONTRACTS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className="sea-preset-btn"
                      onClick={() => loadPreset(preset.id)}
                    >
                      <div>
                        <div className="sea-preset-title">{preset.title}</div>
                        <div className="sea-preset-desc">{preset.description}</div>
                      </div>
                      <span
                        className={`sea-card-badge ${
                          preset.category === 'SCAM_ALERT'
                            ? 'critical'
                            : preset.category === 'PREDATORY_TERMS'
                            ? 'predatory'
                            : 'clean'
                        }`}
                        style={{ marginLeft: '10px' }}
                      >
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                </div>

                {/* PDF Drag & Drop Extractor */}
                <div className="sea-pdf-zone">
                  <input
                    type="file"
                    accept=".pdf"
                    className="sea-pdf-input"
                    onChange={handlePdfChange}
                  />
                  <div className="sea-pdf-label">
                    <span>📄 <strong>Upload Contract PDF</strong></span>
                    <span>100% In-Browser PDF Vector Parser (Zero Network Bytes)</span>
                  </div>
                </div>
              </div>

              {/* Raw Contract Text Input */}
              <div className="sea-glass-card">
                <div className="sea-card-section-title">
                  <h2>Sensitive Contract Text</h2>
                  <span className="sea-card-step-tag">Step 2: Air-Gap Monitored</span>
                </div>

                <div className="sea-textarea-container">
                  <textarea
                    rows={10}
                    className="sea-contract-textarea"
                    value={rawContractText}
                    onChange={(e) => setRawContractText(e.target.value)}
                    placeholder="Paste employment offer or contract containing sensitive personal names, emails, addresses, salaries, and restrictive covenants..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="sea-btn-primary"
                    onClick={() => analyzeLocal()}
                    disabled={isProcessingStage1 || !rawContractText.trim()}
                  >
                    {isProcessingStage1
                      ? 'Scanning On-Device...'
                      : 'Run Stage 1: Air-Gap Redaction & Risk Scan'}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Stage 1 & Stage 2 Audit Intelligence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Stage 1 Results Card */}
              {stage1Result && (
                <div className="sea-glass-card">
                  <div className="sea-card-section-title">
                    <h2>Stage 1: Air-Gapped Local Output</h2>
                    <span className="sea-card-step-tag">Zero PII Leaked</span>
                  </div>

                  <div className="sea-telemetry-row">
                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Risk Score</span>
                      <span
                        className={`sea-telemetry-value ${
                          stage1Result.riskScore >= 70
                            ? 'score-high'
                            : stage1Result.riskScore >= 40
                            ? 'score-med'
                            : 'score-low'
                        }`}
                      >
                        {stage1Result.riskScore} / 100
                      </span>
                    </div>

                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">PII Redacted</span>
                      <span className="sea-telemetry-value">
                        {stage1Result.piiRedactedCount} Tokens
                      </span>
                    </div>

                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Engine</span>
                      <span className="sea-telemetry-value">{stage1Result.engineUsed}</span>
                    </div>

                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Latency</span>
                      <span className="sea-telemetry-value">{stage1Result.latencyMs} ms</span>
                    </div>

                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Network Sent</span>
                      <span className="sea-telemetry-value" style={{ color: '#34D399' }}>
                        {stage1Result.networkBytesSent} Bytes
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--ink)' }}>
                      Local Verdict:
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                      {stage1Result.localVerdict}
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--ink)' }}>
                      Detected Threat Flags:
                    </h3>
                    <ul className="sea-flags-list">
                      {stage1Result.detectedFlags.map((flag, idx) => (
                        <li key={idx} className="sea-flag-item">
                          <span className="sea-flag-dot" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--ink)' }}>
                      Air-Gap Redacted Text (Cloud-Safe Payload):
                    </h3>
                    <textarea
                      rows={5}
                      readOnly
                      className="sea-contract-textarea"
                      style={{ height: '110px', fontSize: '11px', background: 'rgba(10,14,17,0.85)' }}
                      value={stage1Result.redactedText}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    {stage1Result.riskScore >= remoteConfigValues.cloud_escalation_threshold && (
                      <span style={{ fontSize: '11px', color: '#FBBF24', fontFamily: 'var(--font-mono)' }}>
                        ⚠ Risk exceeds Remote Config threshold ({remoteConfigValues.cloud_escalation_threshold}). Cloud escalation recommended.
                      </span>
                    )}

                    <button
                      type="button"
                      className="sea-btn-primary"
                      onClick={escalateToCloud}
                      disabled={isProcessingStage2}
                      style={{ marginLeft: 'auto' }}
                    >
                      {isProcessingStage2
                        ? 'Auditing in Firebase AI Logic Cloud...'
                        : 'Escalate to Stage 2: Cloud Deep Legal Audit'}
                    </button>
                  </div>
                </div>
              )}

              {/* Stage 2 Results Card */}
              {stage2Result && (
                <div className="sea-glass-card">
                  <div className="sea-card-section-title">
                    <h2>Stage 2: Cloud Deep Legal Audit</h2>
                    <span className="sea-card-step-tag">Gemini 2.5 Flash</span>
                  </div>

                  <div className="sea-telemetry-row">
                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Authenticity</span>
                      <span className="sea-telemetry-value" style={{ color: 'var(--clay)' }}>
                        {stage2Result.authenticityVerdict}
                      </span>
                    </div>

                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Engine</span>
                      <span className="sea-telemetry-value">{stage2Result.engineUsed}</span>
                    </div>

                    <div className="sea-telemetry-item">
                      <span className="sea-telemetry-label">Cloud Latency</span>
                      <span className="sea-telemetry-value">{stage2Result.latencyMs} ms</span>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--ink)' }}>
                      Executive Summary:
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                      {stage2Result.executiveSummary}
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--ink)' }}>
                      Clause Breakdown & Risk Analysis:
                    </h3>
                    <div className="sea-clause-breakdown">
                      {stage2Result.clauseBreakdown.map((item, idx) => (
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

                  <div>
                    <h3 style={{ fontSize: '14px', marginBottom: '6px', color: 'var(--ink)' }}>
                      Automated Counter-Offer & Amendment Draft:
                    </h3>
                    <div className="sea-counter-box">
                      <textarea
                        rows={5}
                        readOnly
                        className="sea-counter-textarea"
                        value={stage2Result.counterOfferEmailDraft}
                      />
                      <button
                        type="button"
                        className="sea-copy-btn"
                        onClick={() => handleCopyDraft(stage2Result.counterOfferEmailDraft)}
                      >
                        {copiedDraft ? 'Copied ✓' : 'Copy Draft'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Table: Firestore Anonymized Telemetry */}
          <div className="sea-glass-card sea-table-card">
            <div className="sea-card-section-title">
              <h2>Firestore Anonymized Telemetry</h2>
              <span className="sea-card-step-tag">Zero PII Stored</span>
            </div>

            {history.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                No telemetry records found. Run an air-gapped contract scan to log anonymized telemetry to Firestore.
              </p>
            ) : (
              <table className="sea-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Risk Score</th>
                    <th>Engine</th>
                    <th>Stage 2?</th>
                    <th>Local Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((rec, idx) => (
                    <tr key={rec.id || idx}>
                      <td>{new Date(rec.timestamp).toLocaleTimeString()}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              rec.riskScore >= 70
                                ? '#F87171'
                                : rec.riskScore >= 40
                                ? '#FBBF24'
                                : '#34D399',
                          }}
                        >
                          {rec.riskScore} / 100
                        </span>
                      </td>
                      <td>{rec.engineUsed}</td>
                      <td>{rec.stage2Completed ? 'Escalated' : 'Local Only'}</td>
                      <td>{rec.localVerdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
