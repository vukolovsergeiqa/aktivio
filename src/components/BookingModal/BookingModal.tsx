import React, { useState } from 'react'
import { X, CheckCircle, CreditCard, Wallet } from 'lucide-react'
import type { AktivioEvent } from '../../types'
import s from './BookingModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  event: AktivioEvent
  onBookSuccess: (guestName: string, guestPhone: string, paymentMethod: 'onsite' | 'direct') => void
}

export function BookingModal({ isOpen, onClose, event, onBookSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'direct' | null>(null)

  if (!isOpen) return null

  // Backwards compatibility with events added before payment fields
  const payOnSite = event.payOnSite ?? true
  const payDirect = event.payDirect ?? false

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim() || !guestPhone.trim()) return

    // If only one payment option is available, select it automatically and go to success or show instructions
    if (payOnSite && !payDirect) {
      setPaymentMethod('onsite')
      // Complete booking immediately
      onBookSuccess(guestName.trim(), guestPhone.trim(), 'onsite')
      setStep(3)
    } else if (!payOnSite && payDirect) {
      setPaymentMethod('direct')
      setStep(2) // Need to show bank details
    } else {
      // Both options are available, let the user select
      setStep(2)
    }
  }

  const handleConfirmDirectPayment = () => {
    if (!paymentMethod) return
    onBookSuccess(guestName.trim(), guestPhone.trim(), paymentMethod)
    setStep(3)
  }

  const handleConfirmOnSitePayment = () => {
    onBookSuccess(guestName.trim(), guestPhone.trim(), 'onsite')
    setStep(3)
  }

  const handleSelectMethod = (method: 'onsite' | 'direct') => {
    setPaymentMethod(method)
  }

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.closeBtn} onClick={onClose} aria-label="Закрыть">
          <X size={20} />
        </button>

        {step === 1 && (
          <div>
            <h3 className={s.modalTitle}>Запись на мероприятие</h3>
            <p className={s.eventTitle}>{event.title}</p>
            <form onSubmit={handleNextStep}>
              <div className={s.field}>
                <label className={s.label}>Ваше имя *</label>
                <input
                  type="text"
                  className={s.input}
                  placeholder="Иван Иванов"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>Номер телефона *</label>
                <input
                  type="tel"
                  className={s.input}
                  placeholder="+995 599 123 456"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={s.primaryBtn}>
                Продолжить
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className={s.modalTitle}>Выбор способа оплаты</h3>
            <p className={s.modalSub}>Сумма к оплате: <span className={s.priceHighlight}>{event.price} ₾</span></p>

            <div className={s.optionsGroup}>
              {payOnSite && (
                <div
                  className={`${s.optionCard} ${paymentMethod === 'onsite' ? s.optionCardActive : ''}`}
                  onClick={() => handleSelectMethod('onsite')}
                >
                  <div className={s.optionHeader}>
                    <Wallet className={s.optionIcon} size={20} />
                    <div>
                      <div className={s.optionName}>Оплата на месте</div>
                      <div className={s.optionDesc}>Наличными или картой организатору в день начала</div>
                    </div>
                  </div>
                </div>
              )}

              {payDirect && (
                <div
                  className={`${s.optionCard} ${paymentMethod === 'direct' ? s.optionCardActive : ''}`}
                  onClick={() => handleSelectMethod('direct')}
                >
                  <div className={s.optionHeader}>
                    <CreditCard className={s.optionIcon} size={20} />
                    <div>
                      <div className={s.optionName}>Прямой перевод</div>
                      <div className={s.optionDesc}>По реквизитам на TBC / BoG до мероприятия</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {paymentMethod === 'direct' && event.bankDetails && (
              <div className={s.bankDetailsCard}>
                <h4 className={s.bankHeader}>Реквизиты для перевода:</h4>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Банк:</span>
                  <span className={s.detailValue}>{event.bankDetails.bankName}</span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Получатель:</span>
                  <span className={s.detailValue}>{event.bankDetails.recipient}</span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Номер телефона / IBAN:</span>
                  <span className={s.detailValue} style={{ fontWeight: 'bold' }}>{event.bankDetails.account}</span>
                </div>
                <p className={s.bankHint}>
                  ⚠️ Пожалуйста, переведите <strong>{event.price} ₾</strong> по указанным реквизитам и сохраните чек. Организатор свяжется с вами по указанному телефону для подтверждения бронирования.
                </p>
                <button className={s.primaryBtn} onClick={handleConfirmDirectPayment}>
                  Я перевел сумму, подтвердить
                </button>
              </div>
            )}

            {paymentMethod === 'onsite' && (
              <button className={s.primaryBtn} style={{ marginTop: '20px' }} onClick={handleConfirmOnSitePayment}>
                Забронировать с оплатой на месте
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className={s.successContainer}>
            <CheckCircle className={s.successIcon} size={56} />
            <h3 className={s.successTitle}>Успешно забронировано!</h3>
            <p className={s.successText}>
              Вы записались на мероприятие <strong>«{event.title}»</strong>.
            </p>
            {paymentMethod === 'direct' ? (
              <p className={s.successSubtext}>
                Организатор проверит перевод и свяжется с вами по телефону <strong>{guestPhone}</strong> в ближайшее время.
              </p>
            ) : (
              <p className={s.successSubtext}>
                Сумма к оплате на месте: <strong>{event.price} ₾</strong>. Организатор свяжется с вами для подтверждения деталей.
              </p>
            )}
            <button className={s.primaryBtn} onClick={onClose}>
              Отлично
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
