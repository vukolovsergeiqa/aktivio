import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { MapPin, Calendar, Users } from 'lucide-react'
import { i18nStore } from '../../stores/i18n-store'
import type { AktivioEvent } from '../../types'
import s from './EventCard.module.css'

interface Props {
  event: AktivioEvent
}

function formatDate(dateStr: string, timeStr: string, lang: string) {
  const locale = lang === 'ka' ? 'ka-GE' : lang === 'ru' ? 'ru-RU' : 'en-US'
  const date = new Date(`${dateStr}T${timeStr}`)
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }) + ` · ${timeStr}`
}

export const EventCard = observer(({ event }: Props) => {
  const { currentLang } = i18nStore

  return (
    <Link to={`/event/${event.id}`} className={s.card}>
      <div className={s.imageWrap}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className={s.image}
          loading="lazy"
        />
        <span className={s.badge}>{i18nStore.t('categories.' + event.category)}</span>
      </div>

      <div className={s.body}>
        <h3 className={s.title}>{event.title}</h3>

        <div style={{ display: 'flex', gap: 4, margin: '6px 0 10px' }}>
          {(event.languages || ['en']).map((lang) => (
            <span
              key={lang}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 6px',
                background: 'var(--color-hover)',
                borderRadius: '4px',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
              }}
            >
              {lang === 'ka' ? 'GE' : lang.toUpperCase()}
            </span>
          ))}
        </div>

        <div className={s.meta}>
          <div className={s.metaRow}>
            <Calendar size={13} />
            <span>{formatDate(event.date, event.time, currentLang)}</span>
          </div>
          <div className={s.metaRow}>
            <MapPin size={13} />
            <span>{i18nStore.t('cities.' + event.city)}, {event.address}</span>
          </div>
        </div>

        <div className={s.footer}>
          <span className={s.price}>
            {event.price === 0 ? i18nStore.t('event.free') : `${event.price} ₾`}
          </span>
          <span className={s.spots}>
            <Users size={12} style={{ display: 'inline', marginRight: 3 }} />
            {i18nStore.t('event.spots', { count: event.spots })}
          </span>
        </div>
      </div>
    </Link>
  )
})
