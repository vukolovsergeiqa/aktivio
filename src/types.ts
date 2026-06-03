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

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  tasting: '🍷 Дегустации',
  workshop: '🎨 Мастер-классы',
  tour: '🚶 Экскурсии',
  concert: '🎵 Концерты',
  kids: '👶 Для детей',
  yoga: '🧘 Йога',
  cooking: '🍳 Кулинария',
  other: '📌 Другое',
}

export const CITIES = ['Тбилиси', 'Батуми', 'Кутаиси', 'Мцхета', 'Сигнахи']

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
  bankDetails?: {
    bankName: string
    recipient: string
    account: string
  }
}

export interface Booking {
  id: string
  eventId: string
  guestName: string
  guestPhone: string
  paymentMethod: 'onsite' | 'direct'
  createdAt: string
}
