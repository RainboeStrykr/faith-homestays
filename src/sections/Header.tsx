import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'

interface HeaderProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  forceLight?: boolean
}

const navItems = ['Rooms', 'Amenities', 'Gallery', 'Contact']
const sectionIds = ['#rooms', '#amenities', '#gallery', '#contact']

function getOAuthUrl() {
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = `${window.location.origin}/api/auth/callback`

  const url = new URL(`https://${auth0Domain}/authorize`)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid profile email')
  url.searchParams.set('connection', 'google-oauth2')
  url.searchParams.set('state', window.location.pathname || '/')

  return url.toString()
}

export default function Header({ scrollRef, forceLight = false }: HeaderProps) {
  const [isCompact, setIsCompact] = useState(false)
  const [overHeroRaw, setOverHeroRaw] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const rafRef = useRef<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    const check = () => {
      const y = scrollRef.current.y
      setIsCompact(y > 100)
      setOverHeroRaw(y < window.innerHeight * 0.85)
      rafRef.current = requestAnimationFrame(check)
    }
    rafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollRef])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const overHero = overHeroRaw && !forceLight
  const { user, isAuthenticated } = useAuth({ redirectPath: '/' })

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = '/'
    },
  })

  const handleSignOut = () => {
    if (window.confirm("Do you want to sign out?")) {
      logoutMutation.mutate()
    }
  }

  const handleNavClick = (index: number) => {
    setMenuOpen(false)
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const target = document.querySelector(sectionIds[index])
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const target = document.querySelector(sectionIds[index])
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogoClick = () => {
    setMenuOpen(false)
    if (window.location.pathname !== '/') {
      navigate('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const headerHeight = isCompact ? '64px' : '88px'
  const textColor = overHero ? '#ffffff' : '#000000'

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: headerHeight,
          backgroundColor: overHero && !menuOpen ? 'transparent' : '#ffffff',
          borderBottom: overHero && !menuOpen
            ? '1px solid rgba(255,255,255,0.18)'
            : '1px solid #000000',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 60px)',
          transition:
            'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            cursor: 'pointer',
            color: menuOpen ? '#000000' : textColor,
            transition: 'color 0.4s ease',
            zIndex: 201,
          }}
          onClick={handleLogoClick}
        >
          FAITH
        </div>

        {/* Desktop nav — hidden below md */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex"
          style={{ alignItems: 'stretch', height: '100%' }}
        >
          {navItems.map((item, i) => (
            <NavItem
              key={item}
              label={item}
              overHero={overHero}
              onClick={() => handleNavClick(i)}
            />
          ))}
          {isAuthenticated && user && (
            <NavItem
              label="Dashboard"
              overHero={overHero}
              onClick={() => navigate('/dashboard')}
            />
          )}
          {isAuthenticated && user ? (
            <NavItem
              label="Sign Out"
              overHero={overHero}
              onClick={handleSignOut}
            />
          ) : (
            <NavItem
              label="Sign In"
              overHero={overHero}
              onClick={() => { window.location.href = getOAuthUrl() }}
            />
          )}
        </nav>

        {/* Hamburger button — visible below md */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 201,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            width: '40px',
            height: '40px',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '1.5px',
              backgroundColor: menuOpen ? '#000000' : textColor,
              transformOrigin: 'center',
              transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '1.5px',
              backgroundColor: menuOpen ? '#000000' : textColor,
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s ease, background-color 0.3s ease',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '22px',
              height: '1.5px',
              backgroundColor: menuOpen ? '#000000' : textColor,
              transformOrigin: 'center',
              transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
          />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className="md:hidden"
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: headerHeight,
          left: 0,
          width: '100%',
          height: `calc(100dvh - ${headerHeight})`,
          backgroundColor: '#ffffff',
          zIndex: 199,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px clamp(20px, 6vw, 48px) 48px',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          opacity: menuOpen ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          pointerEvents: menuOpen ? 'auto' : 'none',
          overflowY: 'auto',
        }}
      >
        {/* Nav links */}
        <nav aria-label="Mobile navigation">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item, i) => (
              <li key={item} style={{ borderBottom: '1px solid #e5e5e5' }}>
                <button
                  onClick={() => handleNavClick(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: '"Helvetica Neue", sans-serif',
                    fontSize: 'clamp(28px, 7vw, 40px)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    color: '#000000',
                    textAlign: 'left',
                  }}
                >
                  {item}
                  <span style={{ fontSize: '18px', color: '#999' }}>→</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '32px' }}>
          {isAuthenticated && user && (
            <button
              onClick={() => { setMenuOpen(false); navigate('/dashboard') }}
              style={{
                width: '100%',
                padding: '16px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Helvetica Neue", sans-serif',
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Dashboard
            </button>
          )}
          {isAuthenticated && user ? (
            <button
              onClick={() => { setMenuOpen(false); handleSignOut() }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'transparent',
                color: '#000000',
                border: '1px solid #000000',
                cursor: 'pointer',
                fontFamily: '"Helvetica Neue", sans-serif',
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); window.location.href = getOAuthUrl() }}
              style={{
                width: '100%',
                padding: '16px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Helvetica Neue", sans-serif',
                fontSize: '12px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  )
}

function NavItem({
  label,
  overHero,
  onClick,
}: {
  label: string
  overHero: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const baseColor = overHero ? '#ffffff' : '#000000'
  const hoverBg = overHero ? '#ffffff' : '#000000'
  const hoverFg = overHero ? '#000000' : '#ffffff'

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0.08em',
        backgroundColor: hovered ? hoverBg : 'transparent',
        color: hovered ? hoverFg : baseColor,
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.25s ease, color 0.25s ease',
        whiteSpace: 'nowrap',
        fontFamily: '"Helvetica Neue", sans-serif',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </button>
  )
}

