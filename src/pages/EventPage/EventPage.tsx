import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { eventsStore } from '../../stores/events-store'
import { i18nStore } from '../../stores/i18n-store'
import { BookingModal } from '../../components/BookingModal/BookingModal'
import s from './EventPage.module.css'

function formatDate(dateStr: string, lang: string) {
  const locale = lang === 'ka' ? 'ka-GE' : lang === 'ru' ? 'ru-RU' : 'en-US'
  return new Date(dateStr).toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export const EventPage = observer(() => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const event = eventsStore.getEventById(id ?? '')
  const { currentLang } = i18nStore

  if (!event) {
    return (
      <div className={`container ${s.notFound}`}>
        <p style={{ fontSize: '3rem' }}>🔍</p>
        <h2>Event not found</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          Go to Home
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

  function handleBookSuccess(guestName: string, guestPhone: string, paymentMethod: 'onsite' | 'direct' | 'card' | 'applepay') {
    eventsStore.addBooking({
      eventId,
      guestName,
      guestPhone,
      paymentMethod,
    })
  }

  function handleDelete() {
    if (confirm(i18nStore.t('event.deleteConfirm', { title: eventTitle }))) {
      eventsStore.deleteEvent(eventId)
      navigate('/')
    }
  }

  return (
    <div className={s.page}>
      <div className="container">
        <Link to="/" className={s.back}>
          <ArrowLeft size={16} />
          {i18nStore.t('event.allEvents')}
        </Link>

        <div className={s.layout}>
          {/* Left */}
          <div>
            <div className={s.imageWrap}>
              <img src={event.imageUrl} alt={event.title} className={s.image} />
              <span className={s.badge}>{i18nStore.t('categories.' + event.category)}</span>
            </div>

            <h1 className={s.title}>{event.title}</h1>

            <div className={s.metaRow}>
              <div className={s.metaItem}><Calendar size={16} />{formatDate(event.date, currentLang)}</div>
              <div className={s.metaItem}><Clock size={16} />{event.time}</div>
              <div className={s.metaItem}><MapPin size={16} />{i18nStore.t('cities.' + event.city)}, {event.address}</div>
              <div className={s.metaItem}><Users size={16} />{i18nStore.t('event.spots', { count: event.spots })}</div>
            </div>

            <div className={s.divider} />

            <div>
              <p className={s.sectionLabel}>{i18nStore.t('event.organizer')}</p>
              <p className={s.description}>{event.description}</p>
            </div>

            {eventsStore.currentRole === 'admin' && (
              <div className={s.bookingsSection}>
                <h3 className={s.bookingsTitle}>
                  {i18nStore.t('event.bookingsTitle', { count: bookings.length })}
                </h3>
                {bookings.length === 0 ? (
                  <p className={s.noBookings}>{i18nStore.t('event.noBookings')}</p>
                ) : (
                  <div className={s.tableWrap}>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>{i18nStore.t('event.guestName')}</th>
                          <th>{i18nStore.t('event.phone')}</th>
                          <th>{i18nStore.t('event.payment')}</th>
                          <th>{i18nStore.t('event.bookingDate')}</th>
                          <th>{i18nStore.t('event.action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td style={{ fontWeight: 500 }}>{b.guestName}</td>
                            <td>{b.guestPhone}</td>
                            <td>
                              <span className={
                                b.paymentMethod === 'direct' ? s.payBadgeDirect :
                                b.paymentMethod === 'onsite' ? s.payBadgeOnSite :
                                s.payBadgeCard
                              }>
                                {
                                  b.paymentMethod === 'direct' ? i18nStore.t('modal.methodDirect') :
                                  b.paymentMethod === 'onsite' ? i18nStore.t('modal.methodOnsite') :
                                  b.paymentMethod === 'card' ? i18nStore.t('modal.methodCard') : 'Apple Pay'
                                }
                              </span>
                            </td>
                            <td>{new Date(b.createdAt).toLocaleDateString(currentLang === 'ka' ? 'ka-GE' : currentLang === 'ru' ? 'ru-RU' : 'en-US')}</td>
                            <td>
                              <button
                                className={s.deleteBookingBtn}
                                onClick={() => {
                                  if (confirm(i18nStore.t('event.cancelConfirm', { name: b.guestName }))) {
                                    eventsStore.deleteBooking(b.id)
                                  }
                                }}
                              >
                                {i18nStore.t('event.cancelBooking')}
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
            <div className={s.price}>
              {event.price === 0 ? i18nStore.t('event.free') : `${event.price} ₾`}
            </div>
            <div className={s.priceLabel}>{i18nStore.t('event.perPerson')}</div>

            {event.spots <= 5 && event.spots > 0 && (
              <div className={s.spotsAlert}>
                {i18nStore.t('event.spotsLeft', { count: event.spots })}
              </div>
            )}

            <button className={s.bookBtn} onClick={handleBook}>
              {i18nStore.t('event.bookButton')}
            </button>
            <p className={s.mockNote}>{i18nStore.t('event.paymentOnSiteNote')}</p>

            <div className={s.sideDivider} />

            <div className={s.organizer}>
              <div className={s.avatar}>{initials}</div>
              <div>
                <div className={s.orgName}>{event.organizer}</div>
                <div className={s.orgLabel}>{i18nStore.t('event.organizer')}</div>
              </div>
            </div>

            {eventsStore.currentRole === 'admin' && (
              <>
                <div className={s.sideDivider} />
                <button className={s.deleteBtn} onClick={handleDelete}>
                  {i18nStore.t('event.deleteButton')}
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
