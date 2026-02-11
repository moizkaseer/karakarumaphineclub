import { useState } from 'react'
import { Lock, Unlock, ArrowLeft, LogOut, Calendar, Mail, Users, BookOpen, UserCheck } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { signInWithEmail } from '@/lib/database'
import EventsTab from './admin/EventsTab'
import MessagesTab from './admin/MessagesTab'
import SubscribersTab from './admin/SubscribersTab'
import StoriesTab from './admin/StoriesTab'
import MembershipsTab from './admin/MembershipsTab'

interface AdminPanelProps {
  isAdmin: boolean
  onLogin: () => void
  onLogout: () => void
  onClose: () => void
}

export default function AdminPanel({ isAdmin, onLogin, onLogout, onClose }: AdminPanelProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signInWithEmail(email, password)

    if (error) {
      setError(error.message)
    } else {
      onLogin()
    }
    setLoading(false)
  }

  // Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#F2F5FA] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back to Website</span>
          </button>

          <div className="bg-[#141B26] border border-[#1E293B] p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 border border-[#D4A23A] flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#D4A23A]" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-center text-[#F2F5FA] mb-2">
              Admin Access
            </h1>
            <p className="body-text text-center text-sm mb-8">
              Sign in to access the admin panel
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
                className="w-full mb-4"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full mb-4"
                required
              />
              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>{loading ? 'Signing in...' : 'Access Admin Panel'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0B0F17]">
      {/* Header */}
      <header className="bg-[#141B26] border-b border-[#1E293B] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[#A7B1C4] hover:text-[#F2F5FA] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back</span>
            </button>
            <div className="h-6 w-px bg-[#1E293B]" />
            <h1 className="font-display font-bold text-xl text-[#F2F5FA]">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-[#A7B1C4] hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-mono text-sm">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs defaultValue="events">
          <TabsList className="bg-[#141B26] border border-[#1E293B] mb-6 h-auto p-1 flex-wrap">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-[#D4A23A] data-[state=active]:text-[#0B0F17] text-[#A7B1C4] px-4 py-2"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="data-[state=active]:bg-[#D4A23A] data-[state=active]:text-[#0B0F17] text-[#A7B1C4] px-4 py-2"
            >
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="subscribers"
              className="data-[state=active]:bg-[#D4A23A] data-[state=active]:text-[#0B0F17] text-[#A7B1C4] px-4 py-2"
            >
              <Users className="w-4 h-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger
              value="stories"
              className="data-[state=active]:bg-[#D4A23A] data-[state=active]:text-[#0B0F17] text-[#A7B1C4] px-4 py-2"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Stories
            </TabsTrigger>
            <TabsTrigger
              value="memberships"
              className="data-[state=active]:bg-[#D4A23A] data-[state=active]:text-[#0B0F17] text-[#A7B1C4] px-4 py-2"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Memberships
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events"><EventsTab /></TabsContent>
          <TabsContent value="messages"><MessagesTab /></TabsContent>
          <TabsContent value="subscribers"><SubscribersTab /></TabsContent>
          <TabsContent value="stories"><StoriesTab /></TabsContent>
          <TabsContent value="memberships"><MembershipsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
