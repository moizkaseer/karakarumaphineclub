import { useEffect, useState } from 'react'
import StoriesSection from '@/sections/StoriesSection'
import StoryDetail from '@/sections/StoryDetail'
import type { StoryRow } from '@/lib/database'

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<StoryRow | null>(null)

  useEffect(() => {
    document.title = 'Stories from the Range — Karakoram Alpine Club'
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="relative pt-24">
      {selectedStory && (
        <StoryDetail story={selectedStory} onClose={() => setSelectedStory(null)} />
      )}
      <StoriesSection onStoryClick={setSelectedStory} />
    </main>
  )
}
