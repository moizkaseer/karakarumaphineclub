import { useState, useEffect } from 'react'
import { Mail, MapPin, TrendingUp, Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import {
  getMembershipApplications,
  updateMembershipApplication,
  deleteMembershipApplication,
  type MembershipRow,
} from '@/lib/database'

export default function MembershipsTab() {
  const [applications, setApplications] = useState<MembershipRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<MembershipRow | null>(null)

  const loadApplications = async () => {
    setLoading(true)
    const { data, error } = await getMembershipApplications()
    if (!error && data) {
      setApplications(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleStatusChange = async (id: string, status: MembershipRow['status']) => {
    await updateMembershipApplication(id, { status })
    loadApplications()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteMembershipApplication(id)
      setSelectedApplication(null)
      loadApplications()
    }
  }

  const handleUpdateNotes = async (id: string, notes: string) => {
    await updateMembershipApplication(id, { notes })
    loadApplications()
    if (selectedApplication) {
      setSelectedApplication({ ...selectedApplication, notes })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'reviewing':
        return 'text-blue-400 bg-blue-400/10'
      case 'approved':
        return 'text-green-400 bg-green-400/10'
      case 'rejected':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'reviewing':
        return <Eye className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getExperienceLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  const pendingCount = applications.filter((a) => a.status === 'pending').length

  if (loading) {
    return <div className="p-6 text-[#A7B1C4]">Loading applications...</div>
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#F2F5FA]">Membership Applications</h2>
          <p className="text-sm text-[#A7B1C4] mt-1">
            {applications.length} total • {pendingCount} pending review
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-[#A7B1C4]">
          No membership applications yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                onClick={() => setSelectedApplication(application)}
                className={`p-4 bg-[#0B0F17] border rounded-lg cursor-pointer transition-all hover:border-[#D4A23A] ${
                  selectedApplication?.id === application.id
                    ? 'border-[#D4A23A]'
                    : 'border-[#1E293B]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#F2F5FA]">{application.full_name}</h3>
                    <p className="text-sm text-[#A7B1C4] flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {application.email}
                    </p>
                    <p className="text-sm text-[#A7B1C4] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {application.location}
                    </p>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}
                    {application.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#A7B1C4]">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {getExperienceLabel(application.experience_level)}
                  </span>
                  <span>
                    {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Application Details */}
          <div className="lg:sticky lg:top-0 lg:self-start">
            {selectedApplication ? (
              <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#F2F5FA]">
                      {selectedApplication.full_name}
                    </h3>
                    <p className="text-sm text-[#A7B1C4]">{selectedApplication.email}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedApplication.id)}
                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#A7B1C4] mb-2">
                    Application Status
                  </label>
                  <select
                    value={selectedApplication.status}
                    onChange={(e) =>
                      handleStatusChange(selectedApplication.id, e.target.value as MembershipRow['status'])
                    }
                    className="w-full px-3 py-2 bg-[#151C2A] border border-[#1E293B] rounded-lg text-[#F2F5FA]"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono text-[#A7B1C4] mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-[#F2F5FA]">
                      {selectedApplication.phone || 'Not provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A7B1C4] mb-1">
                      Location
                    </label>
                    <p className="text-sm text-[#F2F5FA]">{selectedApplication.location}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A7B1C4] mb-1">
                      Experience Level
                    </label>
                    <p className="text-sm text-[#F2F5FA]">
                      {getExperienceLabel(selectedApplication.experience_level)}
                    </p>
                  </div>

                  {selectedApplication.climbing_history && (
                    <div>
                      <label className="block text-xs font-mono text-[#A7B1C4] mb-1">
                        Climbing History
                      </label>
                      <p className="text-sm text-[#F2F5FA] whitespace-pre-wrap">
                        {selectedApplication.climbing_history}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono text-[#A7B1C4] mb-1">
                      Motivation
                    </label>
                    <p className="text-sm text-[#F2F5FA] whitespace-pre-wrap">
                      {selectedApplication.motivation}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A7B1C4] mb-1">
                      Applied On
                    </label>
                    <p className="text-sm text-[#F2F5FA]">
                      {new Date(selectedApplication.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-mono text-[#A7B1C4] mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={selectedApplication.notes || ''}
                    onChange={(e) =>
                      setSelectedApplication((previous) =>
                        previous ? { ...previous, notes: e.target.value } : previous
                      )
                    }
                    onBlur={(e) => handleUpdateNotes(selectedApplication.id, e.target.value)}
                    placeholder="Add internal notes about this application..."
                    rows={4}
                    className="w-full px-3 py-2 bg-[#151C2A] border border-[#1E293B] rounded-lg text-[#F2F5FA] text-sm resize-none focus:outline-none focus:border-[#D4A23A]"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-12 text-center text-[#A7B1C4]">
                Select an application to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
