import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { InfiniteSlider } from '../components/ui/infinite-slider'

gsap.registerPlugin(ScrollTrigger)

// All images — property shots + rooms combined into one row
const images = [
  { src: '/images/gallery/gallery (1).jpg',       alt: 'Triple bed family suite' },
  { src: '/images/gallery/gallery (2).jpg',   alt: 'Terrace Lounge with panoramic views' },
  { src: '/images/gallery/gallery (3).jpg',       alt: 'Hospitality at its best' },
  { src: '/images/gallery/gallery (4).jpg', alt: 'Happy Travellers at Faith Dorms' },
  { src: '/images/gallery/gallery (5).jpg',       alt: 'Clean and premium shared washrooms' },
  { src: '/images/gallery/gallery (6).jpg',   alt: 'Budget and Private dorms available' },
  { src: '/images/gallery/gallery (7).jpg',       alt: 'TV space and dining area' },
  { src: '/images/gallery/gallery (8).jpg', alt: 'Sunlit and airy Corridors' },
  { src: '/images/gallery/gallery (9).jpg',       alt: 'Faith Dorms – Co-living space' },
  { src: '/images/gallery/gallery (10).jpg', alt: "Standard AC Rooms" },
  { src: '/images/gallery/gallery (11).jpg',       alt: 'Terrace Lounge with panoramic views' },
  { src: '/images/gallery/gallery (12).jpg',   alt: 'Superior Deluxe Room with bathtub' },
]

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return

    const ctx = gsap.context(() => {
      gsap.from(heading.children, {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      style={{
        backgroundColor: '#0b0b0b',
        padding: '120px 0 140px',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ───────────────────────────────────────────────── */}
      <div
        ref={headingRef}
        style={{
          maxWidth: '1400px',
          margin: '0 auto 72px',
          padding: '0 clamp(20px, 4vw, 60px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            A glimpse inside
          </p>
          <h2
            style={{
              fontSize: 'clamp(38px, 5.5vw, 72px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#ffffff',
            }}
          >
            Our Gallery
          </h2>
        </div>

        <p
          style={{
            fontSize: 'clamp(14px, 1.1vw, 17px)',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '440px',
            textAlign: 'right',
          }}
        >
          Step inside Faith Homestays and see what makes every corner feel
          like home — from sunlit corridors to terrace lounges.
        </p>
      </div>

      {/* ── Single portrait carousel ──────────────────────────────── */}
      <InfiniteSlider speed={45} pauseOnHover>
        {images.map((img) => (
          <GalleryCard key={img.src} {...img} />
        ))}
      </InfiniteSlider>

      {/* ── Bottom label ─────────────────────────────────────────── */}
      <p
        style={{
          textAlign: 'center',
          marginTop: '64px',
          fontSize: '11px',
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
        }}
      >
        Faith The Retreat &middot; Siliguri &middot; West Bengal
      </p>
    </section>
  )
}

function GalleryCard({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <figure
      style={{
        flex: '0 0 auto',
        /* portrait ratio — taller than wide (2:3) */
        width: 'clamp(180px, 16vw, 280px)',
        height: 'clamp(270px, 24vw, 420px)',
        margin: '0 6px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={() => {
        if (imgRef.current) imgRef.current.style.transform = 'scale(1.06)'
      }}
      onMouseLeave={() => {
        if (imgRef.current) imgRef.current.style.transform = 'scale(1)'
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
      <figcaption
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '40px 14px 16px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.85)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        className="gallery-caption"
      >
        {alt}
      </figcaption>
    </figure>
  )
}
