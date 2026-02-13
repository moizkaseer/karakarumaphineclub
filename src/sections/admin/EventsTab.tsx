import { useState, useEffect, useRef } from 'react'
import {
  Plus, Trash2, Edit, Image as ImageIcon, Video,
  Calendar, MapPin, Users, X, Save
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  getEvents, createEvent, updateEvent, deleteEvent,
  uploadEventImage, deleteEventImage
} from '@/lib/database'
import type { EventRow, EventInsert, EventUpdate } from '@/lib/database'

export default function EventsTab() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<EventInsert>>({
    title: '',
    date: '',
    location: '',
    description: '',
    max_participants: 10,
    images: [],
    videos: [],
    status: 'upcoming'
  })

  async function loadEvents() {
    setLoading(true)
    const { data, error } = await getEvents()
    if (!error && data) setEvents(data)
    setLoading(false)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (editingEvent) {
      const updates: EventUpdate = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        description: formData.description,
        max_participants: formData.max_participants,
        images: formData.images,
        videos: formData.videos,
        status: formData.status,
      }
      const { error } = await updateEvent(editingEvent.id, updates)
      if (error) {
        setDialogMessage('Failed to update event: ' + error.message)
      } else {
        setDialogMessage('Event updated successfully!')
      }
    } else {
      const { error } = await createEvent(formData as EventInsert)
      if (error) {
        setDialogMessage('Failed to create event: ' + error.message)
      } else {
        setDialogMessage('New event created successfully!')
      }
    }

    setShowDialog(true)
    setShowEventForm(false)
    setEditingEvent(null)
    resetForm()
    setSaving(false)
    loadEvents()
  }

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const { error } = await deleteEvent(id)
      if (error) {
        setDialogMessage('Failed to delete event: ' + error.message)
      } else {
        setDialogMessage('Event deleted successfully!')
      }
      setShowDialog(true)
      loadEvents()
    }
  }

  const handleEditEvent = (event: EventRow) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      max_participants: event.max_participants,
      images: event.images,
      videos: event.videos,
      status: event.status,
    })
    setShowEventForm(true)
  }

  const handleAddNewEvent = () => {
    setEditingEvent(null)
    resetForm()
    setShowEventForm(true)
  }

  function resetForm() {
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      max_participants: 10,
      images: [],
      videos: [],
      status: 'upcoming'
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    const eventId = editingEvent?.id || 'new'

    for (const file of Array.from(files)) {
      const { data: url, error } = await uploadEventImage(file, eventId)
      if (!error && url) {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), url]
        }))
      }
    }
    setUploadingImages(false)
  }

  const handleRemoveImage = async (index: number) => {
    const imageUrl = formData.images?.[index]
    if (imageUrl && imageUrl.startsWith('http')) {
      await deleteEventImage(imageUrl)
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }))
  }

  const handleVideoAdd = () => {
    const url = prompt('Enter video URL (YouTube/Vimeo):')
    if (url) {
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), url]
      }))
    }
  }

  const handleRemoveVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || []
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-[#A7B1C4] font-mono text-sm">Loading events...</div>
      </div>
    )
  }

  if (showEventForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#F2F5FA]">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={() => setShowEventForm(false)}
            className="text-[#A7B1C4] hover:text-[#F2F5FA]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSaveEvent} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-mono block mb-2">EVENT TITLE</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., K2 Base Camp Trek"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="label-mono block mb-2">DATE</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-mono block mb-2">LOCATION</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Skardu to K2 Base Camp"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="label-mono block mb-2">MAX PARTICIPANTS</label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                min={1}
                max={100}
                className="w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="label-mono block mb-2">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the event..."
              rows={4}
              className="w-full resize-none"
              required
            />
          </div>

          <div>
            <label className="label-mono block mb-2">STATUS</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EventRow['status'] })}
              className="w-full bg-[#141B26] border border-[#1E293B] text-[#F2F5FA] px-4 py-3 outline-none"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="label-mono block mb-2">
              IMAGES {uploadingImages && <span className="text-[#D4A23A]">(uploading...)</span>}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-wrap gap-4">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImages}
                className="w-24 h-24 border-2 border-dashed border-[#1E293B] flex flex-col items-center justify-center text-[#A7B1C4] hover:border-[#D4A23A] hover:text-[#D4A23A] transition-colors"
              >
                <ImageIcon className="w-6 h-6 mb-1" />
                <span className="text-xs">Add</span>
              </button>
            </div>
          </div>

          {/* Videos */}
          <div>
            <label className="label-mono block mb-2">VIDEOS</label>
            <div className="space-y-2">
              {formData.videos?.map((video, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#141B26] p-3">
                  <Video className="w-4 h-4 text-[#D4A23A]" />
                  <span className="text-[#F2F5FA] text-sm flex-1 truncate">{video}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleVideoAdd}
                className="flex items-center gap-2 text-[#D4A23A] hover:text-[#F2F5FA] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Video URL</span>
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowEventForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-[#F2F5FA]">
          Manage Events
        </h2>
        <button
          onClick={handleAddNewEvent}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-[#1E293B] mx-auto mb-4" />
          <p className="body-text">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#141B26] border border-[#1E293B] p-6 group hover:border-[#D4A23A]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs font-mono uppercase tracking-wider ${
                    event.status === 'upcoming' ? 'bg-green-500/20 text-green-400' :
                    event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {event.status}
                  </span>
                  <h3 className="font-display font-bold text-lg text-[#F2F5FA] mt-2">
                    {event.title}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-[#A7B1C4] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-[#D4A23A]" />
                  <span className="text-[#A7B1C4]">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#D4A23A]" />
                  <span className="text-[#A7B1C4]">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[#D4A23A]" />
                  <span className="text-[#A7B1C4]">Max {event.max_participants} participants</span>
                </div>
              </div>

              <p className="body-text text-sm line-clamp-2 mb-4">
                {event.description}
              </p>

              <div className="flex gap-4 text-sm">
                <span className="text-[#A7B1C4]">
                  {event.images.length} images
                </span>
                <span className="text-[#A7B1C4]">
                  {event.videos.length} videos
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#141B26] border-[#1E293B] text-[#F2F5FA]">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {dialogMessage.includes('Failed') ? 'Error' : 'Success'}
            </DialogTitle>
            <DialogDescription className="body-text">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
