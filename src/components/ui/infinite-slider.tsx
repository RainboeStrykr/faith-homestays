import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface InfiniteSliderProps {
  children: React.ReactNode
  /** pixels per second */
  speed?: number
  reverse?: boolean
  pauseOnHover?: boolean
  className?: string
  innerClassName?: string
}

/**
 * Infinite horizontal marquee slider.
 * Duplicates its children to create a seamless loop using a pure CSS keyframe.
 */
export function InfiniteSlider({
  children,
  speed = 60,
  reverse = false,
  pauseOnHover = true,
  className,
  innerClassName,
}: InfiniteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Dynamically set the animation duration based on the track width so speed
  // stays consistent regardless of how many items are inside.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const half = track.scrollWidth / 2
    const duration = half / speed
    track.style.animationDuration = `${duration}s`
  }, [speed])

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <div
        ref={trackRef}
        className={cn('flex w-max', innerClassName)}
        style={{
          animation: `infinite-slide${reverse ? '-reverse' : ''} linear infinite`,
          willChange: 'transform',
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'
        }}
      >
        {/* Render twice for seamless looping */}
        {children}
        {children}
      </div>
    </div>
  )
}
