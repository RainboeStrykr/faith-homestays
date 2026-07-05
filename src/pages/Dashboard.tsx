import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { useState } from 'react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  // Requires auth
  const { user, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: '/login',
  })

  // Dedicated logout mutation — redirects only after cookie is cleared
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = '/'
    },
  })

  const isAdmin = user?.role === 'admin'

  // User query
  const { data: myReservations, isLoading: myDbLoading, refetch: refetchMy } = trpc.reservation.myReservations.useQuery(
    undefined,
    {
      enabled: !!user && !isAdmin,
    }
  )

  // Admin query
  const { data: allReservations, isLoading: allDbLoading, refetch: refetchAll } = trpc.reservation.allReservations.useQuery(
    undefined,
    {
      enabled: !!user && isAdmin,
    }
  )

  // Mutations
  const cancelReservation = trpc.reservation.cancel.useMutation({
    onSuccess: () => {
      setCancellingId(null)
      refetchMy()
    },
    onError: (err) => {
      alert(err.message || 'Failed to cancel reservation.')
      setCancellingId(null)
    }
  })

  const updateReservationStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      setUpdatingId(null)
      refetchAll()
    },
    onError: (err) => {
      alert(err.message || 'Failed to update reservation status.')
      setUpdatingId(null)
    }
  })

  const handleCancel = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setCancellingId(id)
      cancelReservation.mutate({ id })
    }
  }

  const handleUpdateStatus = (id: number, status: 'confirmed' | 'cancelled' | 'pending') => {
    if (window.confirm(`Are you sure you want to change status to "${status}"?`)) {
      setUpdatingId(id)
      updateReservationStatus.mutate({ id, status })
    }
  }

  const isLoading = authLoading || (isAdmin ? allDbLoading : myDbLoading)
  const reservations = isAdmin ? allReservations : myReservations

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-sm tracking-widest uppercase animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight">
              {isAdmin ? 'Admin Portal' : 'Your Dashboard'}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Welcome back, <span className="font-semibold text-black">{user?.name || user?.email}</span> 
              {isAdmin && <span className="ml-2 text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider font-semibold">Admin</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="border border-neutral-300 px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-neutral-50 transition"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                if (window.confirm("Do you want to sign out?")) {
                  logoutMutation.mutate()
                }
              }}
              className="bg-black hover:bg-neutral-900 text-white px-5 py-2.5 text-xs uppercase tracking-wider transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <h2 className="text-lg uppercase tracking-wider font-medium">
            {isAdmin ? 'All Customer Bookings' : 'Your Bookings & Reservations'}
          </h2>
          
          {!reservations || reservations.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-300 bg-neutral-50 space-y-4">
              <p className="text-neutral-500 text-sm">
                {isAdmin ? 'No bookings found in the system.' : 'You do not have any bookings yet.'}
              </p>
              {!isAdmin && (
                <button
                  onClick={() => navigate('/')}
                  className="bg-black hover:bg-neutral-900 text-white px-6 py-3 text-xs uppercase tracking-widest transition"
                >
                  Browse Rooms
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reservations.map((res) => {
                const isPending = res.status === 'pending'
                const isConfirmed = res.status === 'confirmed'
                const isCancelled = res.status === 'cancelled'

                return (
                  <div
                    key={res.id}
                    className="border border-neutral-200 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-sm transition"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-mono text-neutral-400">#RES-{res.id}</span>
                        <span
                          className={`text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 ${
                            isConfirmed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isCancelled
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>

                      <h3 className="text-xl font-medium">{res.roomType}</h3>

                      {/* Customer Info (Admin only) */}
                      {isAdmin && (
                        <div className="bg-neutral-50 border border-neutral-200 p-3 text-xs space-y-2 max-w-xl">
                          <p><span className="text-neutral-400 uppercase tracking-wider text-[9px] block">Customer</span><strong>{res.fullName}</strong></p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                            <p><span className="text-neutral-400 uppercase tracking-wider text-[9px] block">Email</span><a href={`mailto:${res.email}`} className="underline hover:text-neutral-600">{res.email}</a></p>
                            <p><span className="text-neutral-400 uppercase tracking-wider text-[9px] block">Phone</span><a href={`tel:${res.phone}`} className="underline hover:text-neutral-600">{res.phone}</a></p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 pt-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Check In</p>
                          <p className="text-sm font-medium">{res.checkInDate || 'Not Specified'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Check Out</p>
                          <p className="text-sm font-medium">{res.checkOutDate || 'Not Specified'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Guests</p>
                          <p className="text-sm font-medium">{res.guests} Guest(s)</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Booked On</p>
                          <p className="text-sm font-medium">
                            {new Date(res.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {res.message && (
                        <div className="pt-2 text-xs text-neutral-500 max-w-xl">
                          <span className="font-semibold text-neutral-700">Customer message:</span> "{res.message}"
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col items-stretch justify-end gap-2 min-w-[150px]">
                      {isAdmin ? (
                        <>
                          {!isConfirmed && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                              disabled={updatingId === res.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold text-center transition disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}
                          {!isCancelled && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                              disabled={updatingId === res.id}
                              className="border border-rose-200 text-rose-700 hover:bg-rose-50 px-4 py-2 text-xs uppercase tracking-wider font-medium text-center transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                          {(isConfirmed || isCancelled) && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'pending')}
                              disabled={updatingId === res.id}
                              className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 px-4 py-1.5 text-[10px] uppercase tracking-wider font-medium text-center transition disabled:opacity-50"
                            >
                              Reset to Pending
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {isPending && (
                            <button
                              onClick={() => handleCancel(res.id)}
                              disabled={cancellingId === res.id}
                              className="border border-rose-200 text-rose-700 hover:bg-rose-50 px-4 py-2 text-xs uppercase tracking-wider font-medium text-center transition disabled:opacity-50"
                            >
                              {cancellingId === res.id ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                          )}
                          
                          {isCancelled && (
                            <span className="text-xs text-neutral-400 md:text-right italic">
                              Cancelled
                            </span>
                          )}
                          
                          {isConfirmed && (
                            <span className="text-xs text-emerald-600 md:text-right font-medium">
                              Confirmed & Secured
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
