import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Save, X, BookOpen, Eye, EyeOff } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getAllStories, createStory, updateStory, deleteStory } from '@/lib/database'
import type { StoryRow, StoryInsert, StoryUpdate } from '@/lib/database'

export default function StoriesTab() {
  const [stories, setStories] = useState<StoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStory, setEditingStory] = useState<StoryRow | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<StoryInsert>>({
    title: '',
    category: 'Expedition',
    excerpt: '',
    content: '',
    image: '',
    published: false
  })

  async function loadStories() {
    setLoading(true)
    const { data, error } = await getAllStories()
    if (!error && data) setStories(data)
    setLoading(false)
  }

  useEffect(() => {
    loadStories()
  }, [])

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (editingStory) {
      const updates: StoryUpdate = {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        published: formData.published,
      }
      const { error } = await updateStory(editingStory.id, updates)
      if (error) {
        setDialogMessage('Failed to update story: ' + error.message)
      } else {
        setDialogMessage('Story updated successfully!')
      }
    } else {
      const { error } = await createStory(formData as StoryInsert)
      if (error) {
        setDialogMessage('Failed to create story: ' + error.message)
      } else {
        setDialogMessage('New story created successfully!')
      }
    }

    setShowDialog(true)
    setShowForm(false)
    setEditingStory(null)
    resetForm()
    setSaving(false)
    loadStories()
  }

  const handleDeleteStory = async (id: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      const { error } = await deleteStory(id)
      if (error) {
        setDialogMessage('Failed to delete story: ' + error.message)
      } else {
        setDialogMessage('Story deleted successfully!')
      }
      setShowDialog(true)
      loadStories()
    }
  }

  const handleEditStory = (story: StoryRow) => {
    setEditingStory(story)
    setFormData({
      title: story.title,
      category: story.category,
      excerpt: story.excerpt,
      content: story.content,
      image: story.image,
      published: story.published,
    })
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingStory(null)
    resetForm()
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      title: '',
      category: 'Expedition',
      excerpt: '',
      content: '',
      image: '',
      published: false
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-[#A7B1C4] font-mono text-sm">Loading stories...</div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-[#F2F5FA]">
            {editingStory ? 'Edit Story' : 'Create New Story'}
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-[#A7B1C4] hover:text-[#F2F5FA]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSaveStory} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-mono block mb-2">TITLE</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., The K2 Weather Window"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="label-mono block mb-2">CATEGORY</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#141B26] border border-[#1E293B] text-[#F2F5FA] px-4 py-3 outline-none"
              >
                <option value="Expedition">Expedition</option>
                <option value="Conservation">Conservation</option>
                <option value="Training">Training</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-mono block mb-2">EXCERPT</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary shown on cards..."
              rows={2}
              className="w-full resize-none"
              required
            />
          </div>

          <div>
            <label className="label-mono block mb-2">FULL CONTENT</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="The full story content..."
              rows={8}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label className="label-mono block mb-2">IMAGE URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="e.g., /story1.jpg or https://..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, published: !formData.published })}
              className={`flex items-center gap-2 px-4 py-2 border transition-colors ${
                formData.published
                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                  : 'border-[#1E293B] bg-[#141B26] text-[#A7B1C4]'
              }`}
            >
              {formData.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm font-mono">{formData.published ? 'Published' : 'Draft'}</span>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : editingStory ? 'Update Story' : 'Create Story'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
          Manage Stories
        </h2>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Story</span>
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-[#1E293B] mx-auto mb-4" />
          <p className="body-text">No stories yet. Create your first story!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#141B26] border border-[#1E293B] p-6 group hover:border-[#D4A23A]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#D4A23A]">
                      {story.category}
                    </span>
                    <span className={`inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${
                      story.published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {story.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#F2F5FA]">
                    {story.title}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStory(story)}
                    className="p-2 text-[#A7B1C4] hover:text-[#D4A23A] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStory(story.id)}
                    className="p-2 text-[#A7B1C4] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="body-text text-sm line-clamp-2 mb-3">
                {story.excerpt}
              </p>

              {story.image && (
                <div className="text-[#A7B1C4] text-xs font-mono truncate">
                  {story.image}
                </div>
              )}

              <span className="text-[#A7B1C4]/60 text-xs font-mono mt-2 block">
                {new Date(story.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </span>
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
