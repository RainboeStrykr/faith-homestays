import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FUITestimonialWithSlide from "../components/ui/sliding-testimonial";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const slider = sliderRef.current;
    if (!section || !heading || !slider) return;

    const ctx = gsap.context(() => {
      gsap.from(heading.children, {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(slider, {
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      style={{
        backgroundColor: "#0b0b0b",
        padding: "120px 0 140px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        ref={headingRef}
        style={{
          maxWidth: "1400px",
          margin: "0 auto 72px",
          padding: "0 clamp(20px, 4vw, 60px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.26em",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            What guests say
          </p>
          <h2
            style={{
              fontSize: "clamp(38px, 5.5vw, 72px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            Testimonials
          </h2>
        </div>

        <p
          style={{
            fontSize: "clamp(14px, 1.1vw, 17px)",
            fontWeight: 300,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.5)",
            maxWidth: "420px",
            textAlign: "right",
          }}
        >
          Honest words from the travellers who've called Faith home — even if
          just for a night.
        </p>
      </div>

      {/* ── Slider ─────────────────────────────────────────────── */}
      <div ref={sliderRef}>
        <FUITestimonialWithSlide />
      </div>
    </section>
  );
}
