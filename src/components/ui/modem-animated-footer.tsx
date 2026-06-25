"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterProps {
  brandName: string;
  brandDescription: string;
  socialLinks?: SocialLink[];
  navLinks?: NavLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  copyright?: string;
  className?: string;
}

/* ── Component ──────────────────────────────────────────────────────── */

export function Footer({
  brandName,
  brandDescription,
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  copyright,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "relative w-full overflow-hidden bg-background text-foreground border-t border-border",
        className
      )}
    >
      {/* ── Animated background wordmark ──────────────────────────── */}
      <BackgroundText text={brandName} />

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 pt-16 pb-10">

        {/* Top row: brand + nav */}
        <div className="flex flex-wrap gap-12 justify-between items-start mb-14">

          {/* Brand column */}
          <div className="flex flex-col gap-5 max-w-sm">
            {/* Floating brand icon */}
            {brandIcon && (
              <FloatingIcon>{brandIcon}</FloatingIcon>
            )}
            <h2 className="text-2xl font-semibold tracking-tight leading-none">
              {brandName}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {brandDescription}
            </p>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-1 flex-wrap">
                {socialLinks.map((link) => (
                  <SocialButton key={link.label} {...link} />
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          {navLinks.length > 0 && (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <NavItem {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-6 text-xs text-muted-foreground">
          <span>
            {copyright ??
              `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
          </span>
          {creatorName && (
            <span>
              Crafted by{" "}
              {creatorUrl ? (
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  {creatorName}
                </a>
              ) : (
                <span className="font-medium text-foreground">{creatorName}</span>
              )}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */

/**
 * Large animated text that scrolls horizontally in the background.
 * Uses the same CSS keyframe added earlier for the gallery slider.
 */
function BackgroundText({ text }: { text: string }) {
  const repeated = `${text.toUpperCase()} · `.repeat(8);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden select-none"
    >
      <div
        className="flex w-max"
        style={{
          animation: "infinite-slide 24s linear infinite",
          willChange: "transform",
          opacity: 0.06,
          fontSize: "clamp(80px, 15vw, 200px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap",
          lineHeight: 1,
          color: "currentColor",
          // offset downward so only the top portion of the letters is visible
          transform: "translateY(20%)",
        }}
      >
        <span>{repeated}</span>
        <span>{repeated}</span>
      </div>
    </div>
  );
}

/** Gently floating brand icon using CSS animation */
function FloatingIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center shadow-lg"
      style={{ animation: "footer-float 3.6s ease-in-out infinite" }}
    >
      {children}
    </div>
  );
}

/** Social icon button with scale+colour hover */
function SocialButton({ icon, href, label }: SocialLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "w-10 h-10 rounded-full border border-border flex items-center justify-center",
        "text-muted-foreground transition-all duration-200",
        "hover:scale-110 hover:text-foreground hover:border-foreground hover:bg-muted"
      )}
    >
      {icon}
    </a>
  );
}

/** Nav link with slide-right arrow on hover */
function NavItem({ label, href }: NavLink) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="inline-block transition-transform duration-200"
        style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
      >
        {label}
      </span>
      <span
        className="inline-block transition-all duration-200 text-xs"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-6px)" }}
      >
        →
      </span>
    </a>
  );
}
