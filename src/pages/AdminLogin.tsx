import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const utils = trpc.useUtils()

  const { data: session, isLoading: sessionLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  // Already logged in — go straight to admin
  useEffect(() => {
    if (!sessionLoading && session?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [session, sessionLoading, navigate])

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      // Invalidate the cached auth.me so Dashboard sees the new session
      await utils.auth.me.invalidate()
      navigate('/admin', { replace: true })
    },
    onError: (err) => {
      setError(err.message || 'Incorrect password.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate({ password })
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm tracking-widest uppercase animate-pulse text-black">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[11px] tracking-[0.3em] uppercase text-neutral-400">Faith Homestays</p>
          <h1 className="text-2xl font-normal tracking-tight text-black">Admin Access</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="password" className="text-[10px] uppercase tracking-wider text-neutral-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
              className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white text-black"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-black hover:bg-neutral-900 text-white py-3 text-xs font-semibold uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
