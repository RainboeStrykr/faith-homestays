import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Spatial() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.from(content.children, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.4,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '640px',
        overflow: 'hidden',
        backgroundColor: '#0b0b0b',
      }}
    >
      <video
        ref={videoRef}
        src="/videos/sea-hotel.mp4"
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '28px',
          padding: '0 clamp(32px, 4.5vw, 72px)',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.8)',
            textTransform: 'uppercase',
          }}
        >
          Homestay &middot; Studio Rooms &middot; Dormitories
        </span>

        <h1
          style={{
            fontSize: 'clamp(44px, 7vw, 108px)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            color: '#ffffff',
            maxWidth: '920px',
            textShadow: '0 2px 24px rgba(0,0,0,0.25)',
          }}
        >
          Welcome to
          <br />
          Faith The Retreat
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 1.2vw, 18px)',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.88)',
            maxWidth: '520px',
          }}
        >
          A warm, cosy and hygienic homestay that feels like home far from home.
          Faith brings affordable yet premium stay options for every visitor and
          traveller exploring Siliguri and the Eastern Himalayas.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => document.querySelector('#rooms')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#0a0a0a',
              backgroundColor: hovered ? '#ffffff' : '#fee600',
              border: '1px solid transparent',
              padding: '16px 36px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
            }}
          >
            Explore Rooms <span style={{ fontSize: '15px' }}>→</span>
          </button>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.7)',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '16px 36px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  )
}
