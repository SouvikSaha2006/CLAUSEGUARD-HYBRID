// ClauseGuard Hybrid (#BuildHybridAI 2026)
// HomeStage.tsx - Home View Top Row, Editorial Typography & Floating Pointer Preview

import React, { useState, useEffect, useRef } from 'react';
import { SeaRing3D } from './SeaRing3D';
import { RING_16_CARDS, type WorldType, type RingCardData } from '../data/ringCards';

interface HomeStageProps {
  isRevealed: boolean;
  historyCount: number;
  nanoLatency: number | null;
  onNavigateToLab: () => void;
  onCardSelect: (card: RingCardData) => void;
  children?: React.ReactNode;
}

interface ChoiceMeta {
  id: string;
  word: string;
  world: WorldType;
  color: string;
  onText: string;
  cardIndex: number;
}

const CHOICES: ChoiceMeta[] = [
  {
    id: 'choice-1',
    word: 'startups',
    world: 'build',
    color: '#3AA8D0',
    onText: '#04121A',
    cardIndex: 0, // slot-1 Founder IP Assignment
  },
  {
    id: 'choice-2',
    word: 'candidates',
    world: 'brand',
    color: '#EEF4F6',
    onText: '#0A0E11',
    cardIndex: 1, // slot-2 Fake Equipment Check Scam
  },
  {
    id: 'choice-3',
    word: 'freelancers',
    world: 'learn',
    color: '#9ED8E4',
    onText: '#0E2A3B',
    cardIndex: 2, // slot-3 24-Mo Non-Compete
  },
  {
    id: 'choice-4',
    word: 'ask ClauseGuard',
    world: 'learn',
    color: '#9ED8E4',
    onText: '#0E2A3B',
    cardIndex: -1, // special local prompt view
  },
];

export const HomeStage: React.FC<HomeStageProps> = ({
  isRevealed,
  historyCount,
  nanoLatency,
  onNavigateToLab,
  onCardSelect,
  children,
}) => {
  // Active hovered choice
  const [hoveredChoice, setHoveredChoice] = useState<ChoiceMeta | null>(null);

  // Floating preview card pointer tracking with Spring physics (stiffness: 260, damping: 28, mass: 0.6)
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [flipX, setFlipX] = useState<boolean>(false);
  const [flipY, setFlipY] = useState<boolean>(false);

  const targetPtr = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPtr = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityPtr = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Word-masked rise trigger (at reveal + 1.05s)
  const [wordsRisen, setWordsRisen] = useState<boolean>(false);

  useEffect(() => {
    if (!isRevealed) return;

    const timer = setTimeout(() => {
      setWordsRisen(true);
    }, 1050); // reveal + 1.05s

    return () => clearTimeout(timer);
  }, [isRevealed]);

  // Pointer tracking & Hysteresis (+24px) for Viewport-edge flip
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      targetPtr.current = { x: e.clientX, y: e.clientY };

      const cardW = 260;
      const cardH = 240;
      const hysteresis = 24;

      // Flip X check
      if (e.clientX + cardW + 20 > window.innerWidth) {
        setFlipX(true);
      } else if (e.clientX + cardW + 20 + hysteresis < window.innerWidth) {
        setFlipX(false);
      }

      // Flip Y check
      if (e.clientY + cardH + 20 > window.innerHeight) {
        setFlipY(true);
      } else if (e.clientY + cardH + 20 + hysteresis < window.innerHeight) {
        setFlipY(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let lastTime = performance.now();
    let animId: number;

    const springLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const k = 260;  // stiffness
      const d = 28;   // damping
      const m = 0.6;  // mass

      // Spring X
      const fx = -k * (currentPtr.current.x - targetPtr.current.x) - d * velocityPtr.current.x;
      const ax = fx / m;
      velocityPtr.current.x += ax * dt;
      currentPtr.current.x += velocityPtr.current.x * dt;

      // Spring Y
      const fy = -k * (currentPtr.current.y - targetPtr.current.y) - d * velocityPtr.current.y;
      const ay = fy / m;
      velocityPtr.current.y += ay * dt;
      currentPtr.current.y += velocityPtr.current.y * dt;

      setPreviewPos({
        x: currentPtr.current.x,
        y: currentPtr.current.y,
      });

      animId = requestAnimationFrame(springLoop);
    };

    animId = requestAnimationFrame(springLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Sentence Tokens across 3 forced lines
  // Line 1: "I audit contracts for " + Choice 01 startups + ","
  // Line 2: "offer letters for " + Choice 02 candidates + " and privacy traps"
  // Line 3: "for " + Choice 03 freelancers + ". Or just " + Choice 04 ask ClauseGuard + "."
  const sentenceLines: {
    tokens: Array<{
      text?: string;
      choice?: ChoiceMeta;
      isPunctuation?: boolean;
    }>;
  }[] = [
    {
      tokens: [
        { text: 'I' },
        { text: 'audit' },
        { text: 'contracts' },
        { text: 'for' },
        { choice: CHOICES[0] },
        { text: ',', isPunctuation: true },
      ],
    },
    {
      tokens: [
        { text: 'offer' },
        { text: 'letters' },
        { text: 'for' },
        { choice: CHOICES[1] },
        { text: 'and' },
        { text: 'privacy' },
        { text: 'traps' },
      ],
    },
    {
      tokens: [
        { text: 'for' },
        { choice: CHOICES[2] },
        { text: '.', isPunctuation: true },
        { text: 'Or' },
        { text: 'just' },
        { choice: CHOICES[3] },
        { text: '.', isPunctuation: true },
      ],
    },
  ];

  let cumulativeWordIndex = 0;

  return (
    <div className="sea-home-stage-container">
      {/* ===================================================================
          1. HOME TOP ROW (Headline Sentence + Live Stats)
          =================================================================== */}
      <div className="sea-home-top-row">
        {/* Left Headline Sentence (Newsreader 400, 45u, line-height 50u, max-width 800u) */}
        <h1 className="sea-editorial-headline">
          {sentenceLines.map((line, lineIdx) => (
            <div key={lineIdx} className="sea-headline-line">
              {line.tokens.map((token, tokIdx) => {
                const wordIndex = cumulativeWordIndex++;
                // Rise delay stagger: 0.05s + 0.035s * index
                const staggerDelay = 0.05 + 0.035 * wordIndex;
                const isLastInLine = tokIdx === line.tokens.length - 1;

                if (token.choice) {
                  const ch = token.choice;
                  const isHovered = hoveredChoice?.id === ch.id;
                  const isDimmed = hoveredChoice !== null && !isHovered;

                  return (
                    <React.Fragment key={tokIdx}>
                      <span
                        className="sea-word-mask"
                        style={{
                          overflow: 'hidden',
                          display: 'inline-block',
                          verticalAlign: 'bottom',
                          marginRight: '0.28em',
                        }}
                      >
                        <span
                          className="sea-word-rising"
                          style={{
                            display: 'inline-block',
                            transform: wordsRisen ? 'translateY(0%)' : 'translateY(105%)',
                            transition: `transform 0.8s var(--ease) ${staggerDelay}s, opacity 0.4s ease`,
                            opacity: isDimmed ? 0.28 : 1,
                          }}
                        >
                          <span
                            className="sea-choice-interactive"
                            onPointerEnter={() => setHoveredChoice(ch)}
                            onPointerLeave={() => setHoveredChoice(null)}
                            onClick={onNavigateToLab}
                          >
                            <span
                              className="sea-choice-marker"
                              style={{
                                backgroundColor: ch.color,
                                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                                transition: 'transform .5s var(--ease)',
                                transformOrigin: 'left',
                              }}
                            />
                            <span
                              className="sea-choice-text"
                              style={{
                                color: isHovered ? ch.onText : 'var(--ink)',
                                transition: 'color 0.3s ease',
                                fontWeight: 500,
                              }}
                            >
                              {ch.word}
                            </span>
                          </span>
                        </span>
                      </span>
                      {" "}
                    </React.Fragment>
                  );
                }

                // Regular word or punctuation
                const isDimmed = hoveredChoice !== null;
                const isPunct = token.isPunctuation;
                return (
                  <React.Fragment key={tokIdx}>
                    <span
                      className={`sea-word-mask ${isPunct ? 'sea-punct-mask' : ''}`}
                      style={{
                        overflow: 'hidden',
                        display: 'inline-block',
                        verticalAlign: 'bottom',
                        marginRight: isPunct && isLastInLine ? 0 : '0.28em',
                        marginLeft: isPunct ? '-0.28em' : undefined,
                      }}
                    >
                      <span
                        className="sea-word-rising"
                        style={{
                          display: 'inline-block',
                          transform: wordsRisen ? 'translateY(0%)' : 'translateY(105%)',
                          transition: `transform 0.8s var(--ease) ${staggerDelay}s, opacity 0.4s ease`,
                          opacity: isDimmed ? 0.28 : 1,
                        }}
                      >
                        {token.text}
                      </span>
                    </span>
                    {!isPunct && !isLastInLine ? " " : null}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </h1>

        {/* Right Live Stats (3 columns with 28u side padding and 1px dividers) */}
        <div className="sea-live-stats-bar">
          {/* Stat 1: 0 KB / CLOUD PII LEAKED */}
          <div
            className="sea-live-stat-col"
            style={{
              opacity: wordsRisen ? 1 : 0,
              transform: wordsRisen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s var(--ease) 0.35s, transform 0.6s var(--ease) 0.35s',
            }}
          >
            <div className="sea-stat-value" style={{ color: '#34D399' }}>
              0 KB
            </div>
            <div className="sea-stat-label">CLOUD PII LEAKED</div>
          </div>

          {/* Divider */}
          <div className="sea-stat-divider" />

          {/* Stat 2: {historyCount || 16} / AUDITS LOGGED */}
          <div
            className="sea-live-stat-col"
            style={{
              opacity: wordsRisen ? 1 : 0,
              transform: wordsRisen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s var(--ease) 0.45s, transform 0.6s var(--ease) 0.45s',
            }}
          >
            <div className="sea-stat-value">
              {historyCount > 0 ? historyCount : 16}
            </div>
            <div className="sea-stat-label">AUDITS LOGGED</div>
          </div>

          {/* Divider */}
          <div className="sea-stat-divider" />

          {/* Stat 3: <95ms / NANO LATENCY */}
          <div
            className="sea-live-stat-col"
            style={{
              opacity: wordsRisen ? 1 : 0,
              transform: wordsRisen ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.6s var(--ease) 0.55s, transform 0.6s var(--ease) 0.55s',
            }}
          >
            <div className="sea-stat-value" style={{ color: 'var(--clay)' }}>
              {nanoLatency ? `${nanoLatency}ms` : '<95ms'}
            </div>
            <div className="sea-stat-label">NANO LATENCY</div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. FLOATING POINTER PREVIEW CARD (260px, Spring tracked)
          =================================================================== */}
      {hoveredChoice && (
        <div
          className={`sea-pointer-preview-card ${hoveredChoice.id === 'choice-4' ? 'special-night' : ''}`}
          style={{
            transform: `translate3d(${flipX ? previewPos.x - 280 : previewPos.x + 20}px, ${
              flipY ? previewPos.y - 250 : previewPos.y + 20
            }px, 0)`,
            transition: 'opacity 0.25s ease',
          }}
        >
          {hoveredChoice.id === 'choice-4' ? (
            /* Choice 04 ("ask ClauseGuard"): --night bg, no media, Newsreader 28px white with blinking 2px --sage caret */
            <div className="sea-preview-night-box">
              <span className="sea-preview-night-text">Scan any clause locally</span>
              <span className="sea-blinking-caret" />
            </div>
          ) : (
            /* Choices 01-03: First card's poster/video (146px tall) + world pill + blurb */
            <>
              <div className="sea-preview-media-box">
                <img
                  src={RING_16_CARDS[hoveredChoice.cardIndex].posterUrl}
                  alt={RING_16_CARDS[hoveredChoice.cardIndex].title}
                  className="sea-preview-poster"
                />
              </div>
              <div className="sea-preview-content">
                <div className="sea-preview-pill-row">
                  <span
                    className="sea-preview-world-pill"
                    style={{
                      backgroundColor: hoveredChoice.color,
                      color: hoveredChoice.onText,
                    }}
                  >
                    WORLD: {hoveredChoice.world.toUpperCase()}
                  </span>
                  <span className="sea-preview-slot-idx">
                    {RING_16_CARDS[hoveredChoice.cardIndex].slotNumber}
                  </span>
                </div>
                <h4 className="sea-preview-title">
                  {RING_16_CARDS[hoveredChoice.cardIndex].title}
                </h4>
                <p className="sea-preview-blurb">
                  {RING_16_CARDS[hoveredChoice.cardIndex].blurb}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ===================================================================
          2. ROUNDED WORLD FRAME (margin: 0 16u 22u; border-radius: 22u)
          =================================================================== */}
      <div className={`sea-world-frame ${isRevealed ? 'revealed' : ''}`}>
        <div className="sea-frame-inner">
          {children}
          <SeaRing3D
            isRevealed={isRevealed}
            highlightWorld={hoveredChoice?.world ?? null}
            onCardSelect={onCardSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeStage;
