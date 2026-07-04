import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'

interface HeaderProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  forceLight?: boolean
}

const navItems = ['Rooms', 'Services', 'Contact']
const sectionIds = ['#works', '#capabilities', '#footer']

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

  const overHero = overHeroRaw && !forceLight
  const { user, isAuthenticated, logout } = useAuth({ redirectPath: '/' })

  const handleSignOut = () => {
    if (window.confirm("Do you want to sign out?")) {
      logout()
    }
  }

  const handleNavClick = (index: number) => {
    if (window.location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const target = document.querySelector(sectionIds[index])
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const target = document.querySelector(sectionIds[index])
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleLogoClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const textColor = overHero ? '#ffffff' : '#000000'

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: isCompact ? '64px' : '88px',
        backgroundColor: overHero ? 'transparent' : '#ffffff',
        borderBottom: overHero
          ? '1px solid rgba(255,255,255,0.18)'
          : '1px solid #000000',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 60px)',
        transition:
          'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 500,
          letterSpacing: '0.22em',
          cursor: 'pointer',
          color: textColor,
          transition: 'color 0.4s ease',
        }}
        onClick={handleLogoClick}
      >
        FAITH
      </div>

      <nav aria-label="Main navigation" style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
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
    </header>
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

