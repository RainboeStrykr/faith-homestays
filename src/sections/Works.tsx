import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rooms, type Room } from '../data/rooms'
import { trpc } from '@/providers/trpc'

gsap.registerPlugin(ScrollTrigger)

interface WorksProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  onSelectRoom: (id: string) => void
}

// Build capacity map once — { roomId: capacity }
const capacities = Object.fromEntries(
  rooms.map((r) => [r.id, r.capacity ?? 1])
)

// Today as YYYY-MM-DD in local time
function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Works({ scrollRef: _scrollRef, onSelectRoom }: WorksProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const { data: availData } = trpc.reservation.getSoldOutRooms.useQuery({
    date: todayStr(),
    capacities,
  })

  const soldOutSet = new Set(availData?.soldOut ?? [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.work-item', {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="rooms"
      ref={sectionRef}
      style={{
        backgroundColor: '#f4f4f5',
        padding: '120px clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1560px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '60px',
            borderBottom: '1px solid #1a1a1a',
            paddingBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#000000',
            }}
          >
            Premium Rooms
          </h2>
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              color: '#666666',
              textTransform: 'uppercase',
            }}
          >
            Featured Stays
          </span>
        </div>

        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 640px), 1fr))',
            gap: '2px',
          }}
        >
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              soldOut={soldOutSet.has(room.id)}
              onClick={() => !soldOutSet.has(room.id) && onSelectRoom(room.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function RoomCard({
  room,
  soldOut,
  onClick,
}: {
  room: Room
  soldOut: boolean
  onClick: () => void
}) {
  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <button
      onClick={onClick}
      className="work-item"
      disabled={soldOut}
      onMouseEnter={() => {
        if (soldOut) return
        if (imgRef.current) imgRef.current.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={() => {
        if (imgRef.current) imgRef.current.style.transform = 'scale(1)'
      }}
      style={{
        border: '1px solid #000000',
        backgroundColor: '#ffffff',
        padding: 0,
        cursor: soldOut ? 'default' : 'pointer',
        textAlign: 'left',
        display: 'block',
        fontFamily: 'inherit',
        width: '100%',
        overflow: 'hidden',
        opacity: soldOut ? 0.75 : 1,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%',
          overflow: 'hidden',
          backgroundColor: '#e5e5e5',
        }}
      >
        <img
          ref={imgRef}
          src={room.img}
          alt={room.title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            filter: soldOut ? 'grayscale(40%)' : 'none',
          }}
        />
        {soldOut && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '6px 12px',
              fontFamily: '"Helvetica Neue", sans-serif',
            }}
          >
            Sold Out
          </div>
        )}
      </div>
      <div
        style={{
          padding: '20px 24px',
          borderTop: '1px solid #000000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#666666',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            {room.id} &middot; {room.client}
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#000000',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {room.title}
          </p>
        </div>
        <span
          style={{
            fontSize: '12px',
            letterSpacing: '0.14em',
            color: soldOut ? '#999999' : '#000000',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {soldOut ? 'Sold Out' : 'View →'}
        </span>
      </div>
    </button>
  )
}
