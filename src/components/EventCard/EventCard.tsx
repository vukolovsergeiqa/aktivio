import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users } from 'lucide-react'
import { CATEGORY_LABELS } from '../../types'
import type { AktivioEvent } from '../../types'
import s from './EventCard.module.css'

interface Props {
  event: AktivioEvent
}

function formatDate(dateStr: string, timeStr: string) {
  const date = new Date(`${dateStr}T${timeStr}`)
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }) + ` · ${timeStr}`
}

export function EventCard({ event }: Props) {
  return (
    <Link to={`/event/${event.id}`} className={s.card}>
      <div className={s.imageWrap}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className={s.image}
          loading="lazy"
        />
        <span className={s.badge}>{CATEGORY_LABELS[event.category]}</span>
      </div>

      <div className={s.body}>
        <h3 className={s.title}>{event.title}</h3>

        <div className={s.meta}>
          <div className={s.metaRow}>
            <Calendar size={13} />
            <span>{formatDate(event.date, event.time)}</span>
          </div>
          <div className={s.metaRow}>
            <MapPin size={13} />
            <span>{event.city}, {event.address}</span>
          </div>
        </div>

        <div className={s.footer}>
          <span className={s.price}>
            {event.price === 0 ? 'Бесплатно' : `${event.price} ₾`}
          </span>
          <span className={s.spots}>
            <Users size={12} style={{ display: 'inline', marginRight: 3 }} />
            {event.spots} мест
          </span>
        </div>
      </div>
    </Link>
  )
}
