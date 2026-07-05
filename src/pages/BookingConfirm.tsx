import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { rooms } from '../data/rooms'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'

export default function BookingConfirm() {
  const [searchParams] = useSearchParams()
  const roomId = searchParams.get('roomId')
  const navigate = useNavigate()
  
  // Require authentication
  const { user, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: '/login',
  })

  const room = rooms.find((r) => r.id === roomId)

  // Fetch price overrides
  const { data: roomPrices } = trpc.listing.getRoomPrices.useQuery()
  const priceOverride = roomPrices?.find((p) => p.roomId === roomId)
  const displayPrice = priceOverride?.price ?? room?.price
  const displayPriceNote = priceOverride?.priceNote ?? room?.priceNote

  // Form states
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState('2')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Pre-populate user info when user loads
  useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      navigate('/dashboard')
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Something went wrong while booking. Please try again.')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!room) return

    if (!checkInDate || !checkOutDate) {
      setErrorMsg('Please specify check-in and check-out dates.')
      return
    }

    createReservation.mutate({
      checkInDate,
      checkOutDate,
      guests,
      roomType: room.title,
      roomId: room.id,
      fullName,
      email,
      phone,
      message,
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-sm tracking-widest uppercase animate-pulse">Loading auth details...</p>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black gap-4">
        <p className="text-lg">Selected room not found.</p>
        <button
          onClick={() => navigate('/')}
          className="border border-black px-6 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white transition"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-normal tracking-tight mb-2">Confirm Your Booking</h1>
        <p className="text-neutral-500 uppercase tracking-widest text-[10px] mb-12">
          Step 2 of 2 &bull; Secure Payment & Booking Details
        </p>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Input Form & QR Payment */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-neutral-50 border border-neutral-200 p-6 space-y-6">
                <h3 className="text-sm uppercase tracking-wider font-medium border-b border-neutral-200 pb-3">
                  1. Reservation Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Check-In Date</label>
                    <input
                      type="date"
                      required
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Check-Out Date</label>
                    <input
                      type="date"
                      required
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Number of Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter guest name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-500">Special Requests / Message (Optional)</label>
                  <textarea
                    placeholder="Any requests regarding bedding, arrival time, etc."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-neutral-50 border border-neutral-200 p-6 space-y-4">
                <h3 className="text-sm uppercase tracking-wider font-medium border-b border-neutral-200 pb-3">
                  2. Advance Payment (QR Code)
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  To secure your reservation, please scan the QR code below and pay a booking advance of <strong>₹500</strong>.
                  Once done, check the confirmation checkbox below to proceed.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 py-4 bg-white p-4 border border-neutral-200 justify-center">
                  <img
                    src="/images/payment-qr.png"
                    alt="Payment QR Code"
                    className="w-48 h-48 object-contain border border-neutral-100"
                  />
                  <div className="text-center sm:text-left space-y-2">
                    <p className="text-xs uppercase tracking-widest text-neutral-400">Scan to Pay</p>
                    <p className="text-base font-semibold">₹500.00</p>
                    <p className="text-xs text-neutral-500">Faith The Retreat</p>
                    <p className="text-xs text-neutral-400 max-w-[200px]">
                      Supports all UPI apps (BHIM, Google Pay, PhonePe, Paytm, etc.)
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 accent-black h-4 w-4"
                  />
                  <span className="text-xs text-neutral-600 select-none">
                    I confirm that I have made the advance payment of ₹500 via the QR code.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={createReservation.isPending}
                className="w-full bg-black hover:bg-neutral-900 text-white py-4 text-xs font-semibold uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createReservation.isPending ? 'Confirming booking...' : "I've Paid – Confirm Booking"}
              </button>
            </form>
          </div>

          {/* Right Column: Room Summary Card */}
          <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-6 space-y-6 lg:sticky lg:top-28">
            <h3 className="text-sm uppercase tracking-wider font-medium border-b border-neutral-200 pb-3">
              Room Summary
            </h3>

            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200">
              <img
                src={room.img}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                {room.client}
              </p>
              <h4 className="text-xl font-normal">{room.title}</h4>
            </div>

            <div className="border-t border-b border-neutral-200 py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Occupancy:</span>
                <span>{room.occupancy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Bed configuration:</span>
                <span>{room.bed}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider text-neutral-500">Total Price:</span>
              <div className="text-right">
                <p className="text-2xl font-semibold">{displayPrice}</p>
                <p className="text-[10px] text-neutral-400">{displayPriceNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
