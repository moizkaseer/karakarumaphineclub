import { useState, useEffect } from 'react'
import { Mail, MailOpen, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getContactSubmissions, markSubmissionRead } from '@/lib/database'
import type { ContactRow } from '@/lib/database'

export default function MessagesTab() {
  const [submissions, setSubmissions] = useState<ContactRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactRow | null>(null)

  async function loadSubmissions() {
    setLoading(true)
    const { data, error } = await getContactSubmissions()
    if (!error && data) setSubmissions(data)
    setLoading(false)
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  async function handleToggleRead(id: string, currentRead: boolean) {
    await markSubmissionRead(id, !currentRead)
    loadSubmissions()
  }

  function handleViewMessage(message: ContactRow) {
    setSelectedMessage(message)
    if (!message.read) {
      markSubmissionRead(message.id, true).then(() => loadSubmissions())
    }
  }

  const unreadCount = submissions.filter(s => !s.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-[#A7B1C4] font-mono text-sm">Loading messages...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#F2F5FA]">
            Contact Messages
          </h2>
          <p className="text-[#A7B1C4] text-sm mt-1">
            {submissions.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <button
          onClick={loadSubmissions}
          className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="font-mono text-sm">Refresh</span>
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="w-16 h-16 text-[#1E293B] mx-auto mb-4" />
          <p className="body-text">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => handleViewMessage(submission)}
              className={`bg-[#141B26] border p-5 cursor-pointer transition-colors hover:border-[#D4A23A]/30 ${
                submission.read ? 'border-[#1E293B]' : 'border-[#D4A23A]/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {submission.read ? (
                    <MailOpen className="w-5 h-5 text-[#A7B1C4] mt-0.5 shrink-0" />
                  ) : (
                    <Mail className="w-5 h-5 text-[#D4A23A] mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`font-display font-bold ${submission.read ? 'text-[#A7B1C4]' : 'text-[#F2F5FA]'}`}>
                        {submission.name}
                      </span>
                      <span className="text-[#A7B1C4] text-xs font-mono">
                        {submission.email}
                      </span>
                    </div>
                    <p className="text-[#A7B1C4] text-sm mt-1 truncate">
                      {submission.message}
                    </p>
                    <span className="text-[#A7B1C4]/60 text-xs font-mono mt-2 block">
                      {new Date(submission.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleRead(submission.id, submission.read)
                  }}
                  className="text-[#A7B1C4] hover:text-[#D4A23A] transition-colors ml-3 shrink-0"
                  title={submission.read ? 'Mark as unread' : 'Mark as read'}
                >
                  {submission.read ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <MailOpen className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="bg-[#141B26] border-[#1E293B] text-[#F2F5FA] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Message from {selectedMessage?.name}
            </DialogTitle>
            <DialogDescription className="text-[#A7B1C4] text-sm">
              {selectedMessage?.email} &middot;{' '}
              {selectedMessage && new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-[#0B0F17] border border-[#1E293B]">
            <p className="text-[#F2F5FA] text-sm whitespace-pre-wrap leading-relaxed">
              {selectedMessage?.message}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
