import { makeAutoObservable } from 'mobx'
import type { AktivioEvent, EventCategory, UserRole } from '../types'

const STORAGE_KEY = 'aktivio_events'

const DEMO_EVENTS: AktivioEvent[] = [
  {
    id: 'demo-1',
    title: 'Дегустация грузинских вин',
    description:
      'Откройте для себя мир грузинского вина! Вы попробуете 6 сортов вина из разных регионов Грузии — Кахетии, Картли и Имерети. Сомелье расскажет о традиционном методе виноделия в глиняных квеври, которому более 8000 лет. В программе: история грузинского виноделия, знакомство с основными сортами винограда, правила дегустации и закуски.',
    category: 'tasting',
    city: 'Тбилиси',
    address: 'ул. Шардени, 12',
    date: '2026-06-14',
    time: '18:00',
    price: 65,
    spots: 12,
    imageUrl: '/images/event_wine.png',
    organizer: 'Нино Кварацхелия',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Мастер-класс по грузинской керамике',
    description:
      'Создайте своими руками уникальное изделие из глины под руководством мастера с 15-летним опытом. Вы познакомитесь с традиционными грузинскими орнаментами, научитесь работать на гончарном круге и создадите собственную кружку или тарелку. Готовое изделие обожжём и покроем глазурью — заберёте домой через неделю.',
    category: 'workshop',
    city: 'Тбилиси',
    address: 'пер. Бетлеми, 7',
    date: '2026-06-21',
    time: '14:00',
    price: 80,
    spots: 8,
    imageUrl: '/images/event_pottery.png',
    organizer: 'Студия «Тонэ»',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Кулинарный мастер-класс: хинкали и хачапури',
    description:
      'Научитесь готовить главные блюда грузинской кухни! За 3 часа вы приготовите настоящие хинкали с мясом и зеленью и аджарский хачапури с яйцом. Шеф-повар поделится семейными секретами теста и начинки. В конце — совместный обед. Все продукты включены в стоимость.',
    category: 'cooking',
    city: 'Тбилиси',
    address: 'ул. Агмашенебели, 89',
    date: '2026-06-28',
    time: '11:00',
    price: 95,
    spots: 10,
    imageUrl: '/images/event_cooking.png',
    organizer: 'Тамара Джапаридзе',
    createdAt: new Date().toISOString(),
  },
]

class EventsStore {
  events: AktivioEvent[] = []
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
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        this.events = JSON.parse(raw)
      } else {
        this.events = DEMO_EVENTS
        this.saveToStorage()
      }
    } catch {
      this.events = DEMO_EVENTS
    }
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events))
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
