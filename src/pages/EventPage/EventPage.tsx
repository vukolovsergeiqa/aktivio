import { useParams, useNavigate, Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { eventsStore } from '../../stores/events-store'
import { CATEGORY_LABELS } from '../../types'
import s from './EventPage.module.css'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export const EventPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const event = eventsStore.getEventById(id ?? '')

  if (!event) {
    return (
      <div className={`container ${s.notFound}`}>
        <p style={{ fontSize: '3rem' }}>🔍</p>
        <h2>Мероприятие не найдено</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          На главную
        </Link>
      </div>
    )
  }

  const initials = event.organizer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  function handleBook() {
    alert(`✅ Вы записались на «${event!.title}»!\n\nОплата на месте: ${event!.price} ₾\nОрганизатор свяжется с вами для подтверждения.`)
  }

  function handleDelete() {
    if (confirm(`Удалить мероприятие «${event!.title}»?`)) {
      eventsStore.deleteEvent(event!.id)
      navigate('/')
    }
  }

  return (
    <div className={s.page}>
      <div className="container">
        <Link to="/" className={s.back}>
          <ArrowLeft size={16} />
          Все мероприятия
        </Link>

        <div className={s.layout}>
          {/* Left */}
          <div>
            <div className={s.imageWrap}>
              <img src={event.imageUrl} alt={event.title} className={s.image} />
              <span className={s.badge}>{CATEGORY_LABELS[event.category]}</span>
            </div>

            <h1 className={s.title}>{event.title}</h1>

            <div className={s.metaRow}>
              <div className={s.metaItem}><Calendar size={16} />{formatDate(event.date)}</div>
              <div className={s.metaItem}><Clock size={16} />{event.time}</div>
              <div className={s.metaItem}><MapPin size={16} />{event.city}, {event.address}</div>
              <div className={s.metaItem}><Users size={16} />{event.spots} мест</div>
            </div>

            <div className={s.divider} />

            <div>
              <p className={s.sectionLabel}>О мероприятии</p>
              <p className={s.description}>{event.description}</p>
            </div>
          </div>

          {/* Right sticky */}
          <div className={s.sideCard}>
            <div className={s.price}>{event.price === 0 ? 'Бесплатно' : `${event.price} ₾`}</div>
            <div className={s.priceLabel}>за человека</div>

            {event.spots <= 5 && event.spots > 0 && (
              <div className={s.spotsAlert}>
                🔥 Осталось {event.spots} мест
              </div>
            )}

            <button className={s.bookBtn} onClick={handleBook}>
              Забронировать место
            </button>
            <p className={s.mockNote}>Оплата на месте · Демо-режим</p>

            <div className={s.sideDivider} />

            <div className={s.organizer}>
              <div className={s.avatar}>{initials}</div>
              <div>
                <div className={s.orgName}>{event.organizer}</div>
                <div className={s.orgLabel}>Организатор</div>
              </div>
            </div>

            {eventsStore.currentRole === 'admin' && (
              <>
                <div className={s.sideDivider} />
                <button className={s.deleteBtn} onClick={handleDelete}>
                  Удалить мероприятие
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
