"use client";

import { useRef, useState, useEffect, useId } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────
   TextHoverEffect
   Large SVG text whose fill reveals based on mouse position.
──────────────────────────────────────────────────────────────────── */

interface TextHoverEffectProps {
  text: string;
  className?: string;
  /** Duration (seconds) for the spring animation. Default 0 = instant. */
  duration?: number;
}

export function TextHoverEffect({
  text,
  className,
  duration = 0,
}: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [svgRect, setSvgRect] = useState<DOMRect | null>(null);

  // Smooth mouse following with spring
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 120, damping: 20, duration });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20, duration });

  // Map spring values → gradient center as percentage strings
  const gradientX = useTransform(springX, (v) =>
    svgRect ? `${((v - svgRect.left) / svgRect.width) * 100}%` : "50%"
  );
  const gradientY = useTransform(springY, (v) =>
    svgRect ? `${((v - svgRect.top) / svgRect.height) * 100}%` : "50%"
  );

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (svgRef.current && !svgRect) {
      setSvgRect(svgRef.current.getBoundingClientRect());
    }
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  useEffect(() => {
    if (svgRef.current) {
      setSvgRect(svgRef.current.getBoundingClientRect());
    }
  }, []);

  const maskId = `text-mask-${id}`;
  const gradientId = `text-gradient-${id}`;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn("select-none", className)}
    >
      <defs>
        {/* Radial gradient that follows cursor */}
        <motion.radialGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          r="30%"
          cx={gradientX}
          cy={gradientY}
        >
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </motion.radialGradient>

        {/* Text shape used as clip mask */}
        <mask id={maskId}>
          <text
            x="50%"
            y="70%"
            textAnchor="middle"
            fontSize="80"
            fontWeight="700"
            fill="white"
            fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
            letterSpacing="-3"
          >
            {text}
          </text>
        </mask>
      </defs>

      {/* Stroke-only outline (always visible at low opacity) */}
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontSize="80"
        fontWeight="700"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.15"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        letterSpacing="-3"
      >
        {text}
      </text>

      {/* Filled layer, masked to text shape, revealed by cursor gradient */}
      <rect
        width="100%"
        height="100%"
        fill={`url(#${gradientId})`}
        mask={`url(#${maskId})`}
        opacity={hovered ? 1 : 0}
        style={{ transition: "opacity 0.3s ease" }}
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────
   FooterBackgroundGradient
   Subtle animated radial glow blob in the footer background.
──────────────────────────────────────────────────────────────────── */

export function FooterBackgroundGradient({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      {/* Primary glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60%",
          height: "60%",
          bottom: "-20%",
          left: "20%",
          background:
            "radial-gradient(ellipse at center, rgba(60,162,250,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Secondary glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "40%",
          height: "40%",
          bottom: "-10%",
          right: "10%",
          background:
            "radial-gradient(ellipse at center, rgba(120,80,255,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
