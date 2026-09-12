import { trpc } from '@/providers/trpc'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { rooms } from '@/data/rooms'

export default function Dashboard() {
  const navigate = useNavigate()
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [priceNoteInput, setPriceNoteInput] = useState('')
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const utils = trpc.useUtils()

  // Check admin session directly
  const { data: session, isLoading: sessionLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const isAdmin = session?.role === 'admin'

  useEffect(() => {
    if (!sessionLoading && !isAdmin) {
      navigate('/admin/login', { replace: true })
    }
  }, [sessionLoading, isAdmin, navigate])

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null)
      navigate('/admin/login', { replace: true })
    },
  })

  const { data: reservationData, isLoading: reservationsLoading, refetch: refetchAll } =
    trpc.reservation.allReservations.useQuery(
      { page, pageSize: PAGE_SIZE },
      { enabled: isAdmin }
    )

  const allReservations = reservationData?.reservations ?? []
  const totalPages = reservationData?.totalPages ?? 1
  const total = reservationData?.total ?? 0

  const updateReservationStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      setUpdatingId(null)
      refetchAll()
    },
    onError: (err) => {
      alert(err.message || 'Failed to update reservation status.')
      setUpdatingId(null)
    },
  })

  const deleteAllMutation = trpc.reservation.deleteAll.useMutation({
    onSuccess: () => {
      setPage(1)
      refetchAll()
    },
    onError: (err) => {
      alert(err.message || 'Failed to delete reservations.')
    },
  })

  const { data: roomPrices, refetch: refetchPrices } = trpc.listing.getRoomPrices.useQuery(
    undefined,
    { enabled: isAdmin }
  )

  const updateRoomPrice = trpc.listing.updateRoomPrice.useMutation({
    onSuccess: () => {
      setSavingPriceId(null)
      setEditingPriceId(null)
      refetchPrices()
    },
    onError: (err) => {
      alert(err.message || 'Failed to update price.')
      setSavingPriceId(null)
    },
  })

  const getPriceForRoom = (roomId: string) =>
    roomPrices?.find((p) => p.roomId === roomId) ?? null

  const handleEditPrice = (roomId: string, currentPrice: string, currentNote: string) => {
    setEditingPriceId(roomId)
    setPriceInput(currentPrice)
    setPriceNoteInput(currentNote)
  }

  const handleSavePrice = (roomId: string) => {
    if (!priceInput.trim()) return
    setSavingPriceId(roomId)
    updateRoomPrice.mutate({
      roomId,
      price: priceInput.trim(),
      priceNote: priceNoteInput.trim() || 'per night, taxes included',
    })
  }

  const handleUpdateStatus = (id: number, status: 'confirmed' | 'cancelled' | 'pending') => {
    if (window.confirm(`Change status to "${status}"?`)) {
      setUpdatingId(id)
      updateReservationStatus.mutate({ id, status })
    }
  }

  const handleDeleteAll = () => {
    if (window.confirm('Delete ALL reservation requests? This cannot be undone.')) {
      deleteAllMutation.mutate()
    }
  }

  const handleLogout = () => {
    if (window.confirm('Sign out of admin?')) {
      logoutMutation.mutate()
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <p className="text-sm tracking-widest uppercase animate-pulse">Loading...</p>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-white text-black pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight">Admin Portal</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Faith Homestays&nbsp;
              <span className="ml-1 text-xs bg-black text-white px-2 py-0.5 uppercase tracking-wider font-semibold">
                Admin
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="border border-neutral-300 px-5 py-2.5 text-xs uppercase tracking-wider hover:bg-neutral-50 transition"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-neutral-900 text-white px-5 py-2.5 text-xs uppercase tracking-wider transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* All Reservations */}
        <div className="space-y-6">
          {/* Section header with total + delete all */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg uppercase tracking-wider font-medium">All Reservation Requests</h2>
              {total > 0 && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  {total} total &bull; page {page} of {totalPages}
                </p>
              )}
            </div>
            {total > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllMutation.isPending}
                className="border border-rose-200 text-rose-700 hover:bg-rose-50 px-4 py-2 text-xs uppercase tracking-wider font-medium transition disabled:opacity-50 whitespace-nowrap"
              >
                {deleteAllMutation.isPending ? 'Deleting...' : 'Delete All'}
              </button>
            )}
          </div>

          {reservationsLoading ? (
            <div className="text-center py-20">
              <p className="text-sm tracking-widest uppercase animate-pulse text-neutral-400">Loading...</p>
            </div>
          ) : allReservations.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-neutral-300 bg-neutral-50">
              <p className="text-neutral-500 text-sm">No reservation requests yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {allReservations.map((res) => {
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

                        <div className="bg-neutral-50 border border-neutral-200 p-3 text-xs space-y-2 max-w-xl">
                          <p>
                            <span className="text-neutral-400 uppercase tracking-wider text-[9px] block">Customer</span>
                            <strong>{res.fullName}</strong>
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                            <p>
                              <span className="text-neutral-400 uppercase tracking-wider text-[9px] block">Email</span>
                              <a href={`mailto:${res.email}`} className="underline hover:text-neutral-600">{res.email}</a>
                            </p>
                            <p>
                              <span className="text-neutral-400 uppercase tracking-wider text-[9px] block">Phone</span>
                              <a href={`tel:${res.phone}`} className="underline hover:text-neutral-600">{res.phone}</a>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 pt-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-neutral-400">Check In</p>
                            <p className="text-sm font-medium">{res.checkInDate || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-neutral-400">Check Out</p>
                            <p className="text-sm font-medium">{res.checkOutDate || '—'}</p>
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
                            <span className="font-semibold text-neutral-700">Message:</span> "{res.message}"
                          </div>
                        )}
                      </div>

                      {/* Status Actions */}
                      <div className="flex flex-row md:flex-col items-stretch justify-end gap-2 min-w-[150px]">
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
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 text-xs transition ${
                          p === page
                            ? 'bg-black text-white'
                            : 'border border-neutral-300 hover:bg-neutral-50 text-neutral-600'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border border-neutral-300 px-4 py-2 text-xs uppercase tracking-wider hover:bg-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Manage Listing Prices */}
        <div className="space-y-6">
          <div className="border-t border-neutral-200 pt-8">
            <h2 className="text-lg uppercase tracking-wider font-medium mb-1">Manage Listing Prices</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Override the default price for any listing. Changes take effect immediately on the booking pages.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {rooms.map((room) => {
                const override = getPriceForRoom(room.id)
                const activePrice = override?.price ?? room.price
                const activeNote = override?.priceNote ?? room.priceNote
                const isEditing = editingPriceId === room.id
                const isSaving = savingPriceId === room.id

                return (
                  <div
                    key={room.id}
                    className="border border-neutral-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">
                        {room.client}
                      </p>
                      <h3 className="text-sm font-medium truncate">{room.title}</h3>
                      {override ? (
                        <p className="text-xs text-neutral-500 mt-1">
                          <span className="line-through text-neutral-400 mr-1">{room.price}</span>
                          <span className="text-black font-semibold">{override.price}</span>
                          <span className="text-neutral-400 ml-1">— {override.priceNote}</span>
                          <span className="ml-2 text-[9px] uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 font-semibold">
                            Overridden
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs text-neutral-500 mt-1">
                          <span className="font-medium text-black">{room.price}</span>
                          <span className="text-neutral-400 ml-1">— {room.priceNote}</span>
                          <span className="ml-2 text-[9px] uppercase tracking-wider text-neutral-400">Default</span>
                        </p>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 sm:min-w-[420px]">
                        <input
                          type="text"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          placeholder="e.g. ₹1,800"
                          className="border border-neutral-300 px-3 py-2 text-sm w-full sm:w-32 focus:outline-none focus:border-black"
                        />
                        <input
                          type="text"
                          value={priceNoteInput}
                          onChange={(e) => setPriceNoteInput(e.target.value)}
                          placeholder="e.g. per night, taxes included"
                          className="border border-neutral-300 px-3 py-2 text-sm w-full sm:flex-1 focus:outline-none focus:border-black"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSavePrice(room.id)}
                            disabled={isSaving || !priceInput.trim()}
                            className="bg-black hover:bg-neutral-900 text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold transition disabled:opacity-50 whitespace-nowrap"
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            disabled={isSaving}
                            className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 px-4 py-2 text-xs uppercase tracking-wider transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditPrice(room.id, activePrice, activeNote)}
                        className="border border-neutral-300 hover:border-black text-neutral-600 hover:text-black px-4 py-2 text-xs uppercase tracking-wider transition whitespace-nowrap"
                      >
                        Edit Price
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
