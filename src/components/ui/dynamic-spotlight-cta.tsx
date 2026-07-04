"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MouseEvent, useMemo, useState } from "react";

type DynamicSpotlightCTAProps = {
  heading?: string;
  subheading?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  intensity?: number;
  radius?: number;
  showBlur?: boolean;
};

type Particle = {
  left: string;
  top: string;
  size: number;
  travel: number;
  duration: number;
  delay: number;
};

export function DynamicSpotlightCTA({
  heading = "Your next escape starts here.",
  subheading,
  primaryLabel = "Explore Rooms",
  primaryHref = "#rooms",
  secondaryLabel = "Contact Us",
  secondaryHref = "#contact",
  intensity = 0.85,
  radius = 260,
  showBlur = true,
}: DynamicSpotlightCTAProps) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 18 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        travel: Math.random() * 72 - 36,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      })),
    []
  );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <section aria-labelledby="cta-title" className="relative w-full">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition(null)}
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: "#0a0a0a",
          minHeight: "280px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* ── Ambient glows ─────────────────────────────────────── */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute rounded-full"
            style={{
              top: "-10%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "480px",
              height: "280px",
              background: "radial-gradient(ellipse, rgba(254,230,0,0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
            transition={shouldReduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              bottom: "-20%",
              right: "-10%",
              width: "400px",
              height: "400px",
              background: "radial-gradient(ellipse, rgba(254,230,0,0.05) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.2, 0.5, 0.2], rotate: [0, 12, 0] }}
            transition={shouldReduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: "linear" }}
          />
          {showBlur && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 50%, transparent 100%)",
              }}
            />
          )}
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div
          className="relative flex flex-col items-center justify-center text-center"
          style={{ zIndex: 1, padding: "clamp(48px, 7vw, 80px) clamp(24px, 5vw, 60px)", maxWidth: "860px" }}
        >
          {/* Eyebrow pill */}
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full"
            style={{
              border: "1px solid rgba(254,230,0,0.25)",
              backgroundColor: "rgba(254,230,0,0.06)",
              padding: "8px 18px",
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#fee600",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Faith The Retreat · Siliguri
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#fee600", flexShrink: 0 }} />
          </motion.span>

          {/* Heading */}
          <motion.h2
            id="cta-title"
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              fontSize: "clamp(30px, 4.5vw, 56px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#ffffff",
              marginBottom: "24px",
              whiteSpace: "pre-line",
            }}
          >
            {heading}
          </motion.h2>

          {/* Subheading */}
          {subheading && (
            <p
              style={{
                fontSize: "clamp(15px, 1.3vw, 19px)",
                fontWeight: 300,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.55)",
                maxWidth: "600px",
                marginBottom: "48px",
              }}
            >
              {subheading}
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: subheading ? 0 : "40px" }}>
            <a
              href={primaryHref}
              onMouseEnter={() => setPrimaryHovered(true)}
              onMouseLeave={() => setPrimaryHovered(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 36px",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontFamily: '"Helvetica Neue", sans-serif',
                cursor: "pointer",
                transition: "all 0.25s ease",
                backgroundColor: primaryHovered ? "#ffffff" : "#fee600",
                color: "#0a0a0a",
                border: "1px solid transparent",
              }}
            >
              {primaryLabel}
              <span style={{ fontSize: "15px" }}>→</span>
            </a>
            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                onMouseEnter={() => setSecondaryHovered(true)}
                onMouseLeave={() => setSecondaryHovered(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "16px 36px",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: '"Helvetica Neue", sans-serif',
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  backgroundColor: secondaryHovered ? "rgba(255,255,255,0.08)" : "transparent",
                  color: secondaryHovered ? "#ffffff" : "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>

        {/* ── Mouse spotlight ───────────────────────────────────── */}
        <AnimatePresence>
          {!shouldReduceMotion && mousePosition && (
            <motion.div
              key="spotlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: intensity }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute inset-0"
              style={{
                mixBlendMode: "screen",
                background: `radial-gradient(circle ${radius}px at ${mousePosition.x}px ${mousePosition.y}px,
                  rgba(254,230,0,0.22) 0%,
                  rgba(254,230,0,0.1) 45%,
                  rgba(254,230,0,0) 75%)`,
              }}
            >
              <motion.div
                animate={{
                  background: [
                    "radial-gradient(circle, rgba(254,230,0,0.18) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(254,230,0,0.32) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(254,230,0,0.18) 0%, transparent 70%)",
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                  width: `${radius * 1.6}px`,
                  height: `${radius * 1.6}px`,
                  transform: "translate(-50%, -50%)",
                  filter: "blur(32px)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating particles ────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: "rgba(254,230,0,0.2)" }}
              animate={shouldReduceMotion ? undefined : { y: [0, p.travel, 0], opacity: [0.1, 0.45, 0.1] }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>

        {/* ── Border lines ──────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0">
          <div style={{ position: "absolute", inset: "0 0 auto 0", height: "1px", background: "linear-gradient(to right, transparent, rgba(254,230,0,0.35) 50%, transparent)" }} />
          <div style={{ position: "absolute", inset: "auto 0 0 0", height: "1px", background: "linear-gradient(to right, transparent, rgba(254,230,0,0.2) 50%, transparent)" }} />
          <div style={{ position: "absolute", inset: "0 auto 0 0", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(254,230,0,0.2) 50%, transparent)" }} />
          <div style={{ position: "absolute", inset: "0 0 0 auto", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(254,230,0,0.2) 50%, transparent)" }} />
        </div>
      </div>
    </section>
  );
}
