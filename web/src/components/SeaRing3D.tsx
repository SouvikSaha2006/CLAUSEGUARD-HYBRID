// ClauseGuard Hybrid (#BuildHybridAI 2026)
// SeaRing3D.tsx - 3D Cylindrical Ring of 16 Cards with Mathematical Geometry & Spring Physics

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RING_16_CARDS, type WorldType, type RingCardData } from '../data/ringCards';

export type { WorldType, RingCardData };

interface SeaRing3DProps {
  isRevealed: boolean;
  highlightWorld: WorldType | null;
  onCardSelect: (card: RingCardData) => void;
}

export const SeaRing3D: React.FC<SeaRing3DProps> = ({
  isRevealed,
  highlightWorld,
  onCardSelect,
}) => {
  // Expansion e (0..1) over 1.9s cubic-bezier(.5,0,.15,1)
  const [eExpansion, setEExpansion] = useState<number>(0);

  // Rotation spring state
  const ringRotRef = useRef<number>(0);
  const targetRotRef = useRef<number>(0);
  const velocityRotRef = useRef<number>(0);
  const [currentRot, setCurrentRot] = useState<number>(0);

  // Hover state (slows auto-spin to E -> 0.2)
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [cardTilt, setCardTilt] = useState<{ [key: number]: { rx: number; ry: number } }>({});

  // Interaction dragging & threshold tracking
  const isDraggingRef = useRef<boolean>(false);
  const dragStartClientXRef = useRef<number>(0);
  const dragStartRotRef = useRef<number>(0);
  const hasMovedPastThresholdRef = useRef<boolean>(false);
  const dragEndTimeRef = useRef<number>(0);

  // 1. Expansion Animation on Reveal
  useEffect(() => {
    if (!isRevealed) return;

    const startTime = performance.now();
    const duration = 1900; // 1.9s

    // Cubic-bezier(.5, 0, .15, 1) approximation
    const bezierProgress = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    let animId: number;
    const expandStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = bezierProgress(progress);
      setEExpansion(eased);

      if (progress < 1) {
        animId = requestAnimationFrame(expandStep);
      }
    };

    animId = requestAnimationFrame(expandStep);
    return () => cancelAnimationFrame(animId);
  }, [isRevealed]);

  // 2. Exact Mathematical Formulas from the Specification:
  // e: 0 -> 1
  // tilt = -22 * (1 - e)
  // radius = 460 + 1340 * e
  // anchor = -radius * sin(tilt) + 460 * sin(-22deg) * (1 - e)
  // perspective = 1000 + (760 - 1000) * e
  // roll = -20 * (1 - e)
  // cardScale = 0.52 + (2.3 - 0.52) * e^2
  const e = eExpansion;
  const tiltDeg = -22 * (1 - e);
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const radius = 460 + 1340 * e;
  const anchor = -radius * Math.sin(tiltRad) + 460 * Math.sin((-22 * Math.PI) / 180) * (1 - e);
  const perspective = 1000 + (760 - 1000) * e;
  const rollDeg = -20 * (1 - e);
  const cardScale = 0.52 + (2.3 - 0.52) * Math.pow(e, 2);

  // 3. Rotation Spring Physics & Auto-spin Loop
  // Stiffness: 150, Damping: 27, Mass: 1
  // Auto-rotates 0.3 * E * k deg/frame (E -> 0.2 when hovering a card)
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const springLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Auto-rotation increment
      const E = hoveredCardIndex !== null ? 0.2 : 1.0;
      const k = 1.0;
      if (!isDraggingRef.current) {
        targetRotRef.current -= 0.3 * E * k;
      }

      // Spring step
      const stiffness = 150;
      const damping = 27;
      const mass = 1;

      const deltaRot = currentRot - targetRotRef.current;
      const force = -stiffness * deltaRot - damping * velocityRotRef.current;
      const acceleration = force / mass;

      velocityRotRef.current += acceleration * dt;
      const nextRot = ringRotRef.current + velocityRotRef.current * dt;

      ringRotRef.current = nextRot;
      setCurrentRot(nextRot);

      animId = requestAnimationFrame(springLoop);
    };

    animId = requestAnimationFrame(springLoop);
    return () => cancelAnimationFrame(animId);
  }, [currentRot, hoveredCardIndex]);

  // 4. Non-Passive Wheel Event Listener
  // 0.5 * clamp(delta, -480, 480)
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (evt: WheelEvent) => {
      evt.preventDefault();
      const rawDelta = evt.deltaY || evt.deltaX;
      const clampedDelta = Math.max(-480, Math.min(480, rawDelta));
      targetRotRef.current += 0.5 * clampedDelta * 0.08;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // 5. Mouse & 1-Finger Touch Drag Handlers
  // 0.2 factor, 4px drag threshold cancelling clicks within 50ms
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasMovedPastThresholdRef.current = false;
    dragStartClientXRef.current = e.clientX;
    dragStartRotRef.current = targetRotRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartClientXRef.current;
    if (Math.abs(diff) >= 4) {
      hasMovedPastThresholdRef.current = true;
    }
    targetRotRef.current = dragStartRotRef.current + diff * 0.2;
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      dragEndTimeRef.current = performance.now();
    }
  };

  // Card Click: if drag threshold exceeded within 50ms, cancel click
  const handleCardClick = (card: RingCardData) => {
    const elapsedSinceDragEnd = performance.now() - dragEndTimeRef.current;
    if (hasMovedPastThresholdRef.current && elapsedSinceDragEnd < 50) {
      return;
    }
    onCardSelect(card);
  };

  // Card Hover Tilt Spring Physics (rotateX: -20*y, rotateY: 24*x, translateZ: 45px)
  const handleCardPointerMove = useCallback((idx: number, e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1..1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1..1

    setCardTilt((prev) => ({
      ...prev,
      [idx]: {
        rx: -20 * y,
        ry: 24 * x,
      },
    }));
  }, []);

  const handleCardPointerLeave = useCallback((idx: number) => {
    setHoveredCardIndex(null);
    setCardTilt((prev) => ({
      ...prev,
      [idx]: { rx: 0, ry: 0 },
    }));
  }, []);

  return (
    <div
      ref={containerRef}
      className="sea-3d-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        className="sea-3d-ring"
        style={{
          transform: `translate3d(0, ${anchor}px, 0) rotateX(${tiltDeg}deg) rotateZ(${rollDeg}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {RING_16_CARDS.map((card, i) => {
          // Angle per slot (16 cards = 22.5 deg per card)
          const baseSlotAngle = (360 / 16) * i;
          const currentCardAngle = baseSlotAngle + currentRot;

          // Normalized relative angle r in [-180, 180]
          const r = ((currentCardAngle % 360) + 540) % 360 - 180;
          const rRad = (r * Math.PI) / 180;

          // Spatial 3D coordinates
          const x = radius * Math.sin(rRad);
          const z = radius * Math.cos(rRad);

          // 1. Behind camera cull: z * cos(tilt) >= perspective - 70
          const isBehindCamera = z * Math.cos(tiltRad) >= perspective - 70;
          if (isBehindCamera) {
            return null;
          }

          // 2. Backface check: z > radius^2 / perspective
          const isBackface = z > (radius * radius) / perspective;

          // 3. |r| > 96 deg cull after intro expansion e > 0.8
          if (e > 0.8 && Math.abs(r) > 96) {
            return null;
          }

          const isHovered = hoveredCardIndex === i;
          const tilt = cardTilt[i] || { rx: 0, ry: 0 };

          // Dim cards of non-matching worlds when top sentence is hovered
          const isDimmedBySentence = highlightWorld !== null && card.world !== highlightWorld;

          return (
            <div
              key={card.id}
              className={`sea-3d-card-slot ${isBackface ? 'backface' : ''}`}
              style={{
                transform: `translate3d(${x}px, 0, ${z}px) rotateY(${r}deg) scale(${cardScale})`,
                transformStyle: 'preserve-3d',
              }}
              onPointerEnter={() => setHoveredCardIndex(i)}
              onPointerMove={(e) => handleCardPointerMove(i, e)}
              onPointerLeave={() => handleCardPointerLeave(i)}
              onClick={() => handleCardClick(card)}
            >
              {/* Individual Card Body with Reflection & Tilt */}
              <div
                className={`sea-ring-card-wrapper ${isHovered ? 'hovered' : ''}`}
                style={{
                  transform: isHovered
                    ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(45px)`
                    : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
                  transition: isHovered ? 'none' : 'transform 0.45s cubic-bezier(.22,1,.36,1)',
                }}
              >
                {/* Poster / Video Media */}
                <div className="sea-card-media-layer">
                  <img
                    src={card.posterUrl}
                    alt={card.title}
                    className="sea-card-poster"
                    loading="lazy"
                  />
                  {card.videoUrl && (
                    <video
                      src={card.videoUrl}
                      className="sea-card-video"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  )}
                </div>

                {/* Outer 3px World-Colored Border Frame (inset: -9px, border-radius: 24px) */}
                <div
                  className="sea-card-world-border"
                  style={{
                    borderColor: card.worldColor,
                    clipPath: isHovered ? 'inset(0% round 24px)' : 'inset(100% 0 0 0 round 24px)',
                    transition: 'clip-path .55s var(--ease)',
                  }}
                />

                {/* Dimming Overlay when non-matching world is hovered */}
                <div
                  className="sea-card-dim-overlay"
                  style={{
                    opacity: isDimmedBySentence ? 0.6 : 0,
                    backgroundColor: '#0A0E11',
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Bottom-Left Pill: "No. 01" .. "No. 16" (fades out on hover) */}
                <div
                  className="sea-card-bottom-pill"
                  style={{
                    opacity: isHovered ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {card.slotNumber}
                </div>

                {/* Rising World-Colored Label Bar on Hover: WORLD · TITLE ↗ */}
                <div
                  className="sea-card-hover-bar"
                  style={{
                    backgroundColor: card.worldColor,
                    color: card.onTextColor,
                    transform: isHovered ? 'translateY(0%)' : 'translateY(110%)',
                    transition: 'transform 0.4s var(--ease)',
                  }}
                >
                  <span className="sea-hover-world-badge">{card.worldLabel}</span>
                  <span className="sea-hover-title">{card.title}</span>
                  <span className="sea-hover-arrow">↗</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeaRing3D;
