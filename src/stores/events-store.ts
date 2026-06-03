import { makeAutoObservable } from 'mobx'
import type { AktivioEvent, EventCategory, UserRole, Booking } from '../types'

const STORAGE_KEY = 'aktivio_events'
const BOOKINGS_KEY = 'aktivio_bookings'

const DEMO_EVENTS: AktivioEvent[] = [
  {
    id: 'demo-1',
    title: 'Georgian Wine Tasting',
    description:
      'Discover the world of Georgian wine! You will taste 6 varieties of wine from different regions of Georgia — Kakheti, Kartli and Imereti. The sommelier will tell you about the traditional method of winemaking in clay qvevri, which is more than 8000 years old. In the program: history of Georgian winemaking, introduction to main grape varieties, tasting rules and snacks.',
    category: 'tasting',
    city: 'Tbilisi',
    address: '12 Shardeni St',
    date: '2026-06-14',
    time: '18:00',
    price: 65,
    spots: 12,
    imageUrl: '/images/event_wine.png',
    organizer: 'Nino Kvaratskhelia',
    createdAt: new Date().toISOString(),
    payOnSite: true,
    payDirect: true,
    bankDetails: {
      bankName: 'TBC Bank',
      recipient: 'Nino Kvaratskhelia',
      account: '+995555123456',
    },
  },
  {
    id: 'demo-2',
    title: 'Georgian Pottery Workshop',
    description:
      'Create a unique clay piece with your own hands under the guidance of a master with 15 years of experience. You will get acquainted with traditional Georgian ornaments, learn to work on a potter\'s wheel and create your own mug or plate. We will fire the finished piece and cover it with glaze — you can pick it up in a week.',
    category: 'workshop',
    city: 'Tbilisi',
    address: '7 Betlemi St',
    date: '2026-06-21',
    time: '14:00',
    price: 80,
    spots: 8,
    imageUrl: '/images/event_pottery.png',
    organizer: 'Tone Studio',
    createdAt: new Date().toISOString(),
    payOnSite: true,
    payDirect: true,
    bankDetails: {
      bankName: 'Bank of Georgia',
      recipient: 'Tone Studio (Giorgi G.)',
      account: 'GE79BG0000000123456789',
    },
  },
  {
    id: 'demo-3',
    title: 'Cooking Masterclass: Khinkali and Khachapuri',
    description:
      'Learn how to cook the main dishes of Georgian cuisine! In 3 hours you will make authentic khinkali with meat and herbs and Adjaruli khachapuri with egg. The chef will share family secrets of the dough and filling. At the end, a joint lunch. All ingredients are included in the price.',
    category: 'cooking',
    city: 'Tbilisi',
    address: '89 Aghmashenebeli Ave',
    date: '2026-06-28',
    time: '11:00',
    price: 95,
    spots: 10,
    imageUrl: '/images/event_cooking.png',
    organizer: 'Tamara Japaridze',
    createdAt: new Date().toISOString(),
    payOnSite: true,
    payDirect: false,
  },
]

const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    eventId: 'demo-1',
    guestName: 'Alexander Petrov',
    guestPhone: '+995555987654',
    paymentMethod: 'direct',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-2',
    eventId: 'demo-1',
    guestName: 'Maria Ivanova',
    guestPhone: '+995599112233',
    paymentMethod: 'onsite',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-3',
    eventId: 'demo-2',
    guestName: 'David K.',
    guestPhone: '+995577445566',
    paymentMethod: 'direct',
    createdAt: new Date().toISOString(),
  },
]

class EventsStore {
  events: AktivioEvent[] = []
  bookings: Booking[] = []
  filterCategory: EventCategory | 'all' = 'all'
  filterCity: string = 'all'
  searchQuery: string = ''
  currentRole: UserRole = 'guest'

  constructor() {
    makeAutoObservable(this)
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const savedRole = localStorage.getItem('aktivio_role')
      if (savedRole === 'admin' || savedRole === 'guest') {
        this.currentRole = savedRole
      }
      
      const rawEvents = localStorage.getItem(STORAGE_KEY)
      if (rawEvents) {
        this.events = JSON.parse(rawEvents)
      } else {
        this.events = DEMO_EVENTS
        this.saveToStorage()
      }

      const rawBookings = localStorage.getItem(BOOKINGS_KEY)
      if (rawBookings) {
        this.bookings = JSON.parse(rawBookings)
      } else {
        this.bookings = DEMO_BOOKINGS
        this.saveBookingsToStorage()
      }
    } catch {
      this.events = DEMO_EVENTS
      this.bookings = DEMO_BOOKINGS
    }
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events))
  }

  private saveBookingsToStorage() {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(this.bookings))
  }

  addEvent(data: Omit<AktivioEvent, 'id' | 'createdAt'>) {
    const event: AktivioEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.events.unshift(event)
    this.saveToStorage()
    return event.id
  }

  deleteEvent(id: string) {
    this.events = this.events.filter((e) => e.id !== id)
    this.saveToStorage()
  }

  getEventById(id: string): AktivioEvent | undefined {
    return this.events.find((e) => e.id === id)
  }

  setFilterCategory(cat: EventCategory | 'all') {
    this.filterCategory = cat
  }

  setFilterCity(city: string) {
    this.filterCity = city
  }

  setSearchQuery(q: string) {
    this.searchQuery = q
  }

  setRole(role: UserRole) {
    this.currentRole = role
    localStorage.setItem('aktivio_role', role)
  }

  getBookingsByEventId(eventId: string): Booking[] {
    return this.bookings.filter((b) => b.eventId === eventId)
  }

  addBooking(data: Omit<Booking, 'id' | 'createdAt'>) {
    const booking: Booking = {
      ...data,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    this.bookings.push(booking)
    this.saveBookingsToStorage()
    
    const event = this.getEventById(data.eventId)
    if (event && event.spots > 0) {
      event.spots -= 1
      this.saveToStorage()
    }

    return booking
  }

  deleteBooking(id: string) {
    const booking = this.bookings.find((b) => b.id === id)
    if (booking) {
      const event = this.getEventById(booking.eventId)
      if (event) {
        event.spots += 1
        this.saveToStorage()
      }
    }
    this.bookings = this.bookings.filter((b) => b.id !== id)
    this.saveBookingsToStorage()
  }

  get filteredEvents(): AktivioEvent[] {
    return this.events.filter((e) => {
      const matchCat = this.filterCategory === 'all' || e.category === this.filterCategory
      const matchCity = this.filterCity === 'all' || e.city === this.filterCity
      const q = this.searchQuery.toLowerCase()
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
      return matchCat && matchCity && matchSearch
    })
  }
}

export const eventsStore = new EventsStore()
