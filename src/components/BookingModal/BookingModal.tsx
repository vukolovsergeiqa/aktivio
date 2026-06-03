import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { X, CheckCircle, CreditCard, Wallet, Smartphone } from 'lucide-react'
import { i18nStore } from '../../stores/i18n-store'
import type { AktivioEvent } from '../../types'
import s from './BookingModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  event: AktivioEvent
  onBookSuccess: (guestName: string, guestPhone: string, paymentMethod: 'onsite' | 'direct' | 'card' | 'applepay') => void
}

export const BookingModal = observer(({ isOpen, onClose, event, onBookSuccess }: Props) => {
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
        <button className={s.closeBtn} onClick={resetModal} aria-label="Close">
          <X size={20} />
        </button>

        {step === 1 && (
          <div>
            <h3 className={s.modalTitle}>{i18nStore.t('modal.title')}</h3>
            <p className={s.eventTitle}>{event.title}</p>
            <form onSubmit={handleNextStep}>
              <div className={s.field}>
                <label className={s.label}>{i18nStore.t('modal.nameLabel')}</label>
                <input
                  type="text"
                  className={s.input}
                  placeholder={i18nStore.t('modal.namePlaceholder')}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={s.field}>
                <label className={s.label}>{i18nStore.t('modal.phoneLabel')}</label>
                <input
                  type="tel"
                  className={s.input}
                  placeholder={i18nStore.t('modal.phonePlaceholder')}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={s.primaryBtn}>
                {i18nStore.t('modal.continueBtn')}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className={s.modalTitle}>{i18nStore.t('modal.paymentTitle')}</h3>
            <p className={s.modalSub}>
              {i18nStore.t('modal.paymentSub', { price: event.price })}
            </p>

            <div className={s.optionsGroup}>
              {payOnSite && (
                <div
                  className={`${s.optionCard} ${paymentMethod === 'onsite' ? s.optionCardActive : ''}`}
                  onClick={() => handleSelectMethod('onsite')}
                >
                  <div className={s.optionHeader}>
                    <Wallet className={s.optionIcon} size={20} />
                    <div>
                      <div className={s.optionName}>{i18nStore.t('modal.methodOnsite')}</div>
                      <div className={s.optionDesc}>{i18nStore.t('modal.methodOnsiteDesc')}</div>
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
                      <div className={s.optionName}>{i18nStore.t('modal.methodDirect')}</div>
                      <div className={s.optionDesc}>{i18nStore.t('modal.methodDirectDesc')}</div>
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
                      {i18nStore.t('modal.methodCard')} <span className={s.badge}>Soon / Test</span>
                    </div>
                    <div className={s.optionDesc}>{i18nStore.t('modal.methodCardDesc')}</div>
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
                      {i18nStore.t('modal.methodApple')} <span className={s.badge}>Soon / Test</span>
                    </div>
                    <div className={s.optionDesc}>{i18nStore.t('modal.methodAppleDesc')}</div>
                  </div>
                </div>
              </div>
            </div>

            {paymentMethod === 'direct' && event.bankDetails && (
              <div className={s.bankDetailsCard}>
                <h4 className={s.bankHeader}>{i18nStore.t('modal.bankDetailsTitle')}</h4>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>{i18nStore.t('modal.bankName')}</span>
                  <span className={s.detailValue}>{event.bankDetails.bankName}</span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>{i18nStore.t('modal.bankRecipient')}</span>
                  <span className={s.detailValue}>{event.bankDetails.recipient}</span>
                </div>
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>{i18nStore.t('modal.bankAccount')}</span>
                  <span className={s.detailValue} style={{ fontWeight: 'bold' }}>{event.bankDetails.account}</span>
                </div>
                <p className={s.bankHint} dangerouslySetInnerHTML={{
                  __html: i18nStore.t('modal.bankTransferHint', { price: event.price })
                }} />
                <button className={s.primaryBtn} onClick={handleConfirmDirectPayment}>
                  {i18nStore.t('modal.confirmDirectBtn')}
                </button>
              </div>
            )}

            {paymentMethod === 'onsite' && (
              <button className={s.primaryBtn} style={{ marginTop: '20px' }} onClick={handleConfirmOnSitePayment}>
                {i18nStore.t('modal.confirmOnsiteBtn')}
              </button>
            )}

            {paymentMethod === 'card' && (
              <div className={s.bankDetailsCard}>
                <h4 className={s.bankHeader}>💳 {i18nStore.t('modal.methodCard')} (Test Gateway)</h4>
                <div className={s.cardField}>
                  <label className={s.cardLabel}>Card Number</label>
                  <input type="text" className={s.cardInput} placeholder="4444 4444 4444 4444" defaultValue="4444 5555 6666 7777" disabled />
                </div>
                <div className={s.cardRow}>
                  <div className={s.cardField}>
                    <label className={s.cardLabel}>Expiry</label>
                    <input type="text" className={s.cardInput} placeholder="MM/YY" defaultValue="12/29" disabled />
                  </div>
                  <div className={s.cardField}>
                    <label className={s.cardLabel}>CVC</label>
                    <input type="text" className={s.cardInput} placeholder="123" defaultValue="777" disabled />
                  </div>
                </div>
                <button className={s.primaryBtn} style={{ marginTop: '16px' }} onClick={handleCardPayClick} disabled={paying}>
                  {paying ? i18nStore.t('modal.payingCard') : i18nStore.t('modal.confirmCardBtn', { price: event.price })}
                </button>
              </div>
            )}

            {paymentMethod === 'applepay' && (
              <div className={s.bankDetailsCard}>
                <h4 className={s.bankHeader}> Apple Pay / G Pay (Test)</h4>
                <button className={s.applePayBtn} onClick={handleApplePayClick} disabled={paying}>
                  {paying ? i18nStore.t('modal.payingApple') : ' Pay / Google Pay'}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className={s.successContainer}>
            <CheckCircle className={s.successIcon} size={56} />
            <h3 className={s.successTitle}>{i18nStore.t('modal.successTitle')}</h3>
            <p className={s.successText}>
              {i18nStore.t('modal.successText', { title: event.title })}
            </p>
            {paymentMethod === 'direct' && (
              <p className={s.successSubtext}>
                {i18nStore.t('modal.successSubDirect', { phone: guestPhone })}
              </p>
            )}
            {paymentMethod === 'onsite' && (
              <p className={s.successSubtext}>
                {i18nStore.t('modal.successSubOnsite', { price: event.price })}
              </p>
            )}
            {(paymentMethod === 'card' || paymentMethod === 'applepay') && (
              <p className={s.successSubtext}>
                {i18nStore.t('modal.successSubCard', { price: event.price, phone: guestPhone })}
              </p>
            )}
            <button className={s.primaryBtn} onClick={resetModal}>
              {i18nStore.t('modal.successBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
