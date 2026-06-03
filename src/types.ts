export type UserRole = 'guest' | 'admin'

export type EventCategory =
  | 'tasting'
  | 'workshop'
  | 'tour'
  | 'concert'
  | 'kids'
  | 'yoga'
  | 'cooking'
  | 'other'

export const CATEGORIES: EventCategory[] = [
  'tasting',
  'workshop',
  'tour',
  'concert',
  'kids',
  'yoga',
  'cooking',
  'other'
]

export const CITIES = ['Tbilisi', 'Batumi', 'Kutaisi', 'Mtskheta', 'Sighnaghi']

export interface AktivioEvent {
  id: string
  title: string
  description: string
  category: EventCategory
  city: string
  address: string
  date: string       // 'YYYY-MM-DD'
  time: string       // 'HH:MM'
  price: number
  spots: number
  imageUrl: string   // '/images/...' для демо, base64 для загруженных
  organizer: string
  createdAt: string
  payOnSite: boolean
  payDirect: boolean
  languages: string[] // ['en', 'ru', 'ka']
  bankDetails?: {
    bankName: string
    recipient: string
    account: string
  }
}

export const EVENT_LANGUAGES = ['en', 'ru', 'ka']

export interface Booking {
  id: string
  eventId: string
  guestName: string
  guestPhone: string
  paymentMethod: 'onsite' | 'direct' | 'card' | 'applepay'
  createdAt: string
}
