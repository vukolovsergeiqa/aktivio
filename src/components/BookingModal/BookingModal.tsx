import React, { useState } from 'react'
import { X, CheckCircle, CreditCard, Wallet, Smartphone } from 'lucide-react'
import type { AktivioEvent } from '../../types'
import s from './BookingModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  event: AktivioEvent
  onBookSuccess: (guestName: string, guestPhone: string, paymentMethod: 'onsite' | 'direct' | 'card' | 'applepay') => void
}

export function BookingModal({ isOpen, onClose, event, onBookSuccess }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'direct' | 'card' | 'applepay' | null>(null)
  const [paying, setPaying] = useState(false)

  if (!isOpen) return null

  // Backwards compatibility with events added before payment fields
  const payOnSite = event.payOnSite ?? true
  const payDirect = event.payDirect ?? false

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim() || !guestPhone.trim()) return
    setStep(2)
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

  const handleCardPayClick = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      onBookSuccess(guestName.trim(), guestPhone.trim(), 'card')
      setStep(3)
    }, 1500)
  }

  const handleApplePayClick = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      onBookSuccess(guestName.trim(), guestPhone.trim(), 'applepay')
      setStep(3)
    }, 1500)
  }

  const handleSelectMethod = (method: 'onsite' | 'direct' | 'card' | 'applepay') => {
    setPaymentMethod(method)
  }

  const resetModal = () => {
    setStep(1)
    setPaymentMethod(null)
    setPaying(false)
    onClose()
  }

  return (
    <div className={s.overlay} onClick={resetModal}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <button className={s.closeBtn} onClick={resetModal} aria-label="Закрыть">
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

              {/* Blurred premium payment method: Card */}
              <div
                className={`${s.optionCard} ${s.optionCardBlurred} ${paymentMethod === 'card' ? s.optionCardActiveUnblurred : ''}`}
                onClick={() => handleSelectMethod('card')}
              >
                <div className={s.optionHeader}>
                  <CreditCard className={s.optionIcon} size={20} />
                  <div>
                    <div className={s.optionName}>
                      Банковская карта <span className={s.badge}>Скоро / Тест</span>
                    </div>
                    <div className={s.optionDesc}>Оплата картой TBC / Bank of Georgia на сайте</div>
                  </div>
                </div>
              </div>

              {/* Blurred premium payment method: Apple/Google Pay */}
              <div
                className={`${s.optionCard} ${s.optionCardBlurred} ${paymentMethod === 'applepay' ? s.optionCardActiveUnblurred : ''}`}
                onClick={() => handleSelectMethod('applepay')}
              >
                <div className={s.optionHeader}>
                  <Smartphone className={s.optionIcon} size={20} />
                  <div>
                    <div className={s.optionName}>
                      Apple Pay / Google Pay <span className={s.badge}>Скоро / Тест</span>
                    </div>
                    <div className={s.optionDesc}>Быстрая оплата в один клик</div>
                  </div>
                </div>
              </div>
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

            {paymentMethod === 'card' && (
              <div className={s.bankDetailsCard}>
                <h4 className={s.bankHeader}>💳 Оплата картой (Тестовый шлюз TBC)</h4>
                <div className={s.cardField}>
                  <label className={s.cardLabel}>Номер карты</label>
                  <input type="text" className={s.cardInput} placeholder="4444 4444 4444 4444" defaultValue="4444 5555 6666 7777" disabled />
                </div>
                <div className={s.cardRow}>
                  <div className={s.cardField}>
                    <label className={s.cardLabel}>Срок действия</label>
                    <input type="text" className={s.cardInput} placeholder="MM/YY" defaultValue="12/29" disabled />
                  </div>
                  <div className={s.cardField}>
                    <label className={s.cardLabel}>CVC</label>
                    <input type="text" className={s.cardInput} placeholder="123" defaultValue="777" disabled />
                  </div>
                </div>
                <button className={s.primaryBtn} style={{ marginTop: '16px' }} onClick={handleCardPayClick} disabled={paying}>
                  {paying ? 'Обработка платежа TBC Checkout...' : `Оплатить ${event.price} ₾ (Тест)`}
                </button>
              </div>
            )}

            {paymentMethod === 'applepay' && (
              <div className={s.bankDetailsCard}>
                <h4 className={s.bankHeader}> Apple Pay / G Pay (Тест)</h4>
                <button className={s.applePayBtn} onClick={handleApplePayClick} disabled={paying}>
                  {paying ? 'Авторизация...' : ' Pay / Google Pay'}
                </button>
              </div>
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
            {paymentMethod === 'direct' && (
              <p className={s.successSubtext}>
                Организатор проверит перевод и свяжется с вами по телефону <strong>{guestPhone}</strong> в ближайшее время.
              </p>
            )}
            {paymentMethod === 'onsite' && (
              <p className={s.successSubtext}>
                Сумма к оплате на месте: <strong>{event.price} ₾</strong>. Организатор свяжется с вами для подтверждения деталей.
              </p>
            )}
            {(paymentMethod === 'card' || paymentMethod === 'applepay') && (
              <p className={s.successSubtext}>
                🎉 Имитация оплаты завершена! Сумма <strong>{event.price} ₾</strong> успешно списана. Организатор свяжется с вами по телефону <strong>{guestPhone}</strong>.
              </p>
            )}
            <button className={s.primaryBtn} onClick={resetModal}>
              Отлично
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
