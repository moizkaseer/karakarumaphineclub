import { useState, useEffect } from 'react'
import { Users, RefreshCw } from 'lucide-react'
import { getNewsletterSubscribers, updateSubscriberStatus } from '@/lib/database'
import type { SubscriberRow } from '@/lib/database'

export default function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscribers()
  }, [])

  async function loadSubscribers() {
    setLoading(true)
    const { data, error } = await getNewsletterSubscribers()
    if (!error && data) setSubscribers(data)
    setLoading(false)
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    await updateSubscriberStatus(id, !currentActive)
    loadSubscribers()
  }

  const activeCount = subscribers.filter(s => s.active).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-[#A7B1C4] font-mono text-sm">Loading subscribers...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#F2F5FA]">
            Newsletter Subscribers
          </h2>
          <p className="text-[#A7B1C4] text-sm mt-1">
            {subscribers.length} total &middot; {activeCount} active
          </p>
        </div>
        <button
          onClick={loadSubscribers}
          className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="font-mono text-sm">Refresh</span>
        </button>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-[#1E293B] mx-auto mb-4" />
          <p className="body-text">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-[#141B26] border border-[#1E293B]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 border-b border-[#1E293B] text-xs font-mono uppercase tracking-wider text-[#A7B1C4]">
            <span>Email</span>
            <span>Subscribed</span>
            <span>Status</span>
          </div>
          {subscribers.map((subscriber) => (
            <div
              key={subscriber.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 border-b border-[#1E293B] last:border-b-0 items-center"
            >
              <span className="text-[#F2F5FA] text-sm truncate">
                {subscriber.email}
              </span>
              <span className="text-[#A7B1C4] text-xs font-mono">
                {new Date(subscriber.subscribed_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </span>
              <button
                onClick={() => handleToggleActive(subscriber.id, subscriber.active)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                  subscriber.active
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                }`}
              >
                {subscriber.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
