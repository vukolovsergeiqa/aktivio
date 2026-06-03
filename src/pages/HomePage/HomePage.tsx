import { observer } from 'mobx-react-lite'
import { eventsStore } from '../../stores/events-store'
import { EventCard } from '../../components/EventCard/EventCard'
import { CATEGORY_LABELS, CITIES } from '../../types'
import type { EventCategory } from '../../types'
import s from './HomePage.module.css'

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS) as [EventCategory, string][]

export const HomePage = observer(() => {
  const { filteredEvents, filterCategory, filterCity, searchQuery } = eventsStore

  return (
    <>
      {/* Hero */}
      <section className={s.hero}>
        <div className="container">
          <h1 className={s.heroTitle}>
            Всё интересное <span>Тбилиси</span><br />в одном месте
          </h1>
          <p className={s.heroSub}>
            Мастер-классы, дегустации, экскурсии и многое другое — находи и бронируй за пару кликов
          </p>
          <div className={s.searchRow}>
            <input
              className={s.searchInput}
              type="text"
              placeholder="Поиск мероприятий..."
              value={searchQuery}
              onChange={(e) => eventsStore.setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className={s.filters}>
        <div className={`container ${s.filtersInner}`}>
          <button
            className={`${s.chip} ${filterCategory === 'all' ? s.chipActive : ''}`}
            onClick={() => eventsStore.setFilterCategory('all')}
          >
            🗓 Все
          </button>
          {ALL_CATEGORIES.map(([key, label]) => (
            <button
              key={key}
              className={`${s.chip} ${filterCategory === key ? s.chipActive : ''}`}
              onClick={() => eventsStore.setFilterCategory(key)}
            >
              {label}
            </button>
          ))}
          <select
            className={s.citySelect}
            value={filterCity}
            onChange={(e) => eventsStore.setFilterCity(e.target.value)}
          >
            <option value="all">Все города</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Event grid */}
      <section className={s.section}>
        <div className="container">
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>Ближайшие мероприятия</h2>
            <span className={s.count}>{filteredEvents.length} событий</span>
          </div>

          <div className={s.grid}>
            {filteredEvents.length === 0 ? (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🔍</div>
                <p className={s.emptyTitle}>Ничего не найдено</p>
                <p className={s.emptyText}>Попробуйте изменить фильтры или добавьте первое мероприятие</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
})
