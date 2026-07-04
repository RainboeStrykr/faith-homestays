import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './sections/Header'
import Hero from './sections/Hero'
import Philosophy from './sections/Philosophy'
import Works from './sections/Works'
import Capabilities from './sections/Capabilities'
import Spatial from './sections/Spatial'
import Gallery from './sections/Gallery'
import Testimonials from './sections/Testimonials'
import Footer from './sections/Footer'
import Preloader from './sections/Preloader'
import Login from './pages/Login'
import BookingConfirm from './pages/BookingConfirm'
import Dashboard from './pages/Dashboard'
import RoomDetail from './pages/RoomDetail'

function App() {
  const scrollRef = useRef({ y: 0, speed: 0 })
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)

  useEffect(() => {
    let rafId: number
    let prevY = window.scrollY

    const tick = () => {
      const y = window.scrollY
      const delta = y - prevY
      scrollRef.current.y = y
      scrollRef.current.speed = delta
      prevY = y
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleSelectRoom = (id: string) => setCurrentRoomId(id)
  const handleBack = () => {
    setCurrentRoomId(null)
    setTimeout(() => {
      document.querySelector('#works')?.scrollIntoView({ behavior: 'auto' })
    }, 0)
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/booking/confirm" element={
        <>
          <Preloader />
          <Header scrollRef={scrollRef} forceLight={true} />
          <BookingConfirm />
          <Footer />
        </>
      } />
      <Route path="/dashboard" element={
        <>
          <Preloader />
          <Header scrollRef={scrollRef} forceLight={true} />
          <Dashboard />
          <Footer />
        </>
      } />
      <Route path="*" element={
        <>
          <Preloader />
          <Header scrollRef={scrollRef} forceLight={currentRoomId !== null} />
          {currentRoomId ? (
            <RoomDetail roomId={currentRoomId} onBack={handleBack} />
          ) : (
            <main>
              <Spatial />
              <Philosophy />
              <Works scrollRef={scrollRef} onSelectRoom={handleSelectRoom} />
              <Capabilities />
              <Gallery />
              <Testimonials />
              <Hero />
            </main>
          )}
          <Footer />
        </>
      } />
    </Routes>
  )
}

export default App

