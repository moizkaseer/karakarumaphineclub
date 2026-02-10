import { supabase } from './supabase'
import type { Database } from './database.types'

// Type aliases
export type EventRow = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']
export type ContactRow = Database['public']['Tables']['contact_submissions']['Row']
export type ContactInsert = Database['public']['Tables']['contact_submissions']['Insert']
export type StoryRow = Database['public']['Tables']['stories']['Row']
export type StoryInsert = Database['public']['Tables']['stories']['Insert']
export type StoryUpdate = Database['public']['Tables']['stories']['Update']
export type SubscriberRow = Database['public']['Tables']['newsletter_subscribers']['Row']

// ==================== AUTH ====================

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback: (session: unknown) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}

// ==================== EVENTS ====================

export async function getEvents() {
  return supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
}

export async function createEvent(event: EventInsert) {
  return supabase.from('events').insert(event).select().single()
}

export async function updateEvent(id: string, updates: EventUpdate) {
  return supabase.from('events').update(updates).eq('id', id).select().single()
}

export async function deleteEvent(id: string) {
  return supabase.from('events').delete().eq('id', id)
}

// ==================== CONTACT SUBMISSIONS ====================

export async function submitContactForm(submission: ContactInsert) {
  return supabase.from('contact_submissions').insert(submission)
}

export async function getContactSubmissions() {
  return supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function markSubmissionRead(id: string, read: boolean) {
  return supabase
    .from('contact_submissions')
    .update({ read })
    .eq('id', id)
}

// ==================== NEWSLETTER ====================

export async function subscribeNewsletter(email: string) {
  return supabase
    .from('newsletter_subscribers')
    .upsert({ email, active: true }, { onConflict: 'email' })
}

export async function getNewsletterSubscribers() {
  return supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })
}

export async function updateSubscriberStatus(id: string, active: boolean) {
  return supabase
    .from('newsletter_subscribers')
    .update({ active })
    .eq('id', id)
}

// ==================== STORIES ====================

export async function getPublishedStories() {
  return supabase
    .from('stories')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
}

export async function getAllStories() {
  return supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })
}

export async function createStory(story: StoryInsert) {
  return supabase.from('stories').insert(story).select().single()
}

export async function updateStory(id: string, updates: StoryUpdate) {
  return supabase.from('stories').update(updates).eq('id', id).select().single()
}

export async function deleteStory(id: string) {
  return supabase.from('stories').delete().eq('id', id)
}

// ==================== STORAGE (Event Images) ====================

export async function uploadEventImage(file: File, eventId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${eventId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(fileName, file)

  if (error) return { data: null, error }

  const { data: urlData } = supabase.storage
    .from('event-images')
    .getPublicUrl(data.path)

  return { data: urlData.publicUrl, error: null }
}

export async function deleteEventImage(filePath: string) {
  try {
    const url = new URL(filePath)
    const pathParts = url.pathname.split('/storage/v1/object/public/event-images/')
    const storagePath = pathParts[1] || ''
    return supabase.storage.from('event-images').remove([storagePath])
  } catch {
    return { data: null, error: new Error('Invalid image URL') }
  }
}
