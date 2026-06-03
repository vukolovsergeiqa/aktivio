import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { eventsStore } from '../../stores/events-store'
import { CATEGORY_LABELS } from '../../types'
import { BookingModal } from '../../components/BookingModal/BookingModal'
import s from './EventPage.module.css'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export const EventPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
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

  const bookings = eventsStore.getBookingsByEventId(event.id)
  const eventId = event.id
  const eventTitle = event.title
  const initials = event.organizer.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  function handleBook() {
    setIsBookingOpen(true)
  }

  function handleBookSuccess(guestName: string, guestPhone: string, paymentMethod: 'onsite' | 'direct') {
    eventsStore.addBooking({
      eventId,
      guestName,
      guestPhone,
      paymentMethod,
    })
  }

  function handleDelete() {
    if (confirm(`Удалить мероприятие «${eventTitle}»?`)) {
      eventsStore.deleteEvent(eventId)
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

            {eventsStore.currentRole === 'admin' && (
              <div className={s.bookingsSection}>
                <h3 className={s.bookingsTitle}>Список записей ({bookings.length})</h3>
                {bookings.length === 0 ? (
                  <p className={s.noBookings}>Записей на это мероприятие пока нет.</p>
                ) : (
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Имя гостя</th>
                          <th>Телефон</th>
                          <th>Оплата</th>
                          <th>Дата записи</th>
                          <th>Действие</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td style={{ fontWeight: 500 }}>{b.guestName}</td>
                            <td>{b.guestPhone}</td>
                            <td>
                              <span className={b.paymentMethod === 'direct' ? s.payBadgeDirect : s.payBadgeOnSite}>
                                {b.paymentMethod === 'direct' ? 'Перевод' : 'На месте'}
                              </span>
                            </td>
                            <td>{new Date(b.createdAt).toLocaleDateString('ru-RU')}</td>
                            <td>
                              <button
                                className={s.deleteBookingBtn}
                                onClick={() => {
                                  if (confirm(`Отменить запись гостя ${b.guestName}?`)) {
                                    eventsStore.deleteBooking(b.id)
                                  }
                                }}
                              >
                                Отменить запись
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
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
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        event={event}
        onBookSuccess={handleBookSuccess}
      />
    </div>
  )
})
