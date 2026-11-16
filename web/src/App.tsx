// ClauseGuard Hybrid (#BuildHybridAI 2026)
// Sea Ring Atmospheric Architecture, Opening Sequence & Zero-Trust Contract Firewall

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useClauseGuard } from './hooks/useClauseGuard';
import { HomeStage } from './components/HomeStage';
import { BuildAuditLab } from './components/BuildAuditLab';
import { RING_16_CARDS, type RingCardData } from './data/ringCards';
import './styles/seaRing.css';

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
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261111_232613_bf108dd9-dc98-4729-9163-748475f20b61.mp4';

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

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Navigation & View State ('home' = FIREWALL, 'build' = AUDIT LAB)
  const [currentView, setCurrentView] = useState<'home' | 'build'>(() => {
    return typeof window !== 'undefined' && window.location.hash === '#build' ? 'build' : 'home';
  });

  // Opening Sequence State ('running' | 'revealing' | 'completed')
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
  const [videoPlaying, setVideoPlaying] = useState(false);

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

  // 1. Sync URL hash with current view (Section 9: View Routing)
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
    const totalAssets = RING_16_CARDS.length;

    // Preload each card image
    RING_16_CARDS.forEach((card) => {
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
    if (currentView === 'home' && videoHomeRef.current) {
      videoHomeRef.current.play().catch(() => {});
    }
  }, [currentView]);

  // 8. Fine-pointer Spring Parallax Loop
  // Stiffness: 40, Damping: 18, Mass: 1
  useEffect(() => {
    if (reducedMotion) return;

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
  }, [reducedMotion]);

  // Card select -> Load into Audit Lab & Switch View
  const handleSelectSlotCard = (card: RingCardData) => {
    if (card.presetId) {
      loadPreset(card.presetId);
    } else if (card.sampleContract) {
      setRawContractText(card.sampleContract);
    }
    window.location.hash = '#build';
    setCurrentView('build');
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
          <div
            className="sea-nav-status-pill"
            title="Click to check/refresh Gemini Nano on-device status"
            onClick={refreshNanoStatus}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                refreshNanoStatus();
              }
            }}
          >
            <span
              className={`sea-status-indicator ${
                nanoStatus === 'ready'
                  ? 'ready'
                  : nanoStatus === 'downloading'
                  ? 'downloading'
                  : 'unavailable'
              }`}
            />
            <span>NANO: {nanoStatus.toUpperCase()}</span>
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
          3. VIEW: HOME (#view-home) - SECTION 6 EDITORIAL TOP ROW & 3D SEA RING
          ===================================================================== */}
      <div
        id="view-home"
        style={{ display: currentView === 'home' ? 'block' : 'none' }}
      >
        <HomeStage
          isRevealed={introState !== 'running'}
          historyCount={history.length}
          nanoLatency={stage1Result?.latencyMs ?? null}
          onNavigateToLab={() => {
            window.location.hash = '#build';
            setCurrentView('build');
          }}
          onCardSelect={handleSelectSlotCard}
        >
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
          {!reducedMotion && <div className="sea-grain-layer" />}

          {/* 12 Back Petals */}
          {!reducedMotion && (
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
          )}

          {/* Bottom White Mist Layer (height: 46%) */}
          <div
            className={`sea-mist-layer ${introState !== 'running' ? 'risen' : ''}`}
            style={{
              transform: `translate3d(${parallaxOffset.mistX}px, ${parallaxOffset.mistY}px, 0)`,
            }}
          />

          {/* 5 Front Petals (z: 3) */}
          {!reducedMotion && (
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
          )}

          {/* 14 Glowing Motes (z: 4) */}
          {!reducedMotion && (
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
          )}
        </HomeStage>
      </div>

      {/* =====================================================================
          4. VIEW: AUDIT LAB (#view-build) - SECTION 7 HYBRID AUDIT LAB
          ===================================================================== */}
      <div
        id="view-build"
        style={{ display: currentView === 'build' ? 'block' : 'none' }}
      >
        <BuildAuditLab
          nanoStatus={nanoStatus}
          remoteConfigValues={remoteConfigValues}
          history={history}
          rawContractText={rawContractText}
          setRawContractText={setRawContractText}
          isProcessingStage1={isProcessingStage1}
          isProcessingStage2={isProcessingStage2}
          stage1Result={stage1Result}
          stage2Result={stage2Result}
          error={error}
          analyzeLocal={analyzeLocal}
          escalateToCloud={escalateToCloud}
          loadPreset={loadPreset}
          uploadPdf={uploadPdf}
          refreshRemoteConfig={refreshRemoteConfig}
          refreshNanoStatus={refreshNanoStatus}
          reducedMotion={reducedMotion}
        />
      </div>
    </>
  );
}

export default App;
