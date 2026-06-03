import { observer } from 'mobx-react-lite'
import { eventsStore } from '../../stores/events-store'
import { i18nStore } from '../../stores/i18n-store'
import { EventCard } from '../../components/EventCard/EventCard'
import { CitySelect } from '../../components/CitySelect/CitySelect'
import { CATEGORIES } from '../../types'
import s from './HomePage.module.css'

export const HomePage = observer(() => {
  const { filteredEvents, filterCategory, filterCity, searchQuery } = eventsStore

  return (
    <>
      {/* Hero */}
      <section className={s.hero}>
        <div className="container">
          <h1 className={s.heroTitle}>
            {i18nStore.t('home.heroTitle')}
          </h1>
          <p className={s.heroSub}>
            {i18nStore.t('home.heroSub')}
          </p>
          <div className={s.searchRow}>
            <input
              className={s.searchInput}
              type="text"
              placeholder={i18nStore.t('home.searchPlaceholder')}
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
            {i18nStore.t('home.allCats')}
          </button>
          {CATEGORIES.map((catKey) => (
            <button
              key={catKey}
              className={`${s.chip} ${filterCategory === catKey ? s.chipActive : ''}`}
              onClick={() => eventsStore.setFilterCategory(catKey)}
            >
              {i18nStore.t('categories.' + catKey)}
            </button>
          ))}
          <CitySelect
            value={filterCity}
            onChange={(val) => eventsStore.setFilterCity(val)}
            showAllOption
            variant="pill"
          />
        </div>
      </div>

      {/* Event grid */}
      <section className={s.section}>
        <div className="container">
          <div className={s.sectionHeader}>
            <h2 className={s.sectionTitle}>{i18nStore.t('home.nearestEvents')}</h2>
            <span className={s.count}>
              {i18nStore.t('home.eventsCount', { count: filteredEvents.length })}
            </span>
          </div>

          <div className={s.grid}>
            {filteredEvents.length === 0 ? (
              <div className={s.empty}>
                <div className={s.emptyIcon}>🔍</div>
                <p className={s.emptyTitle}>{i18nStore.t('home.nothingFound')}</p>
                <p className={s.emptyText}>{i18nStore.t('home.nothingFoundSub')}</p>
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
