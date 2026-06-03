import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { eventsStore } from '../../stores/events-store'
import { i18nStore } from '../../stores/i18n-store'
import { CATEGORIES, CITIES } from '../../types'
import type { EventCategory } from '../../types'
import { DatePicker } from '../../components/DatePicker/DatePicker'
import { TimePicker } from '../../components/TimePicker/TimePicker'
import s from './AddEventPage.module.css'

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
          else { width = Math.round((width * MAX) / height); height = MAX }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.onerror = reject
      img.src = e.target!.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const AddEventPage = observer(() => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (eventsStore.currentRole === 'guest') {
    return (
      <div className={s.deniedPage}>
        <div className={s.deniedContainer}>
          <div className={s.deniedIcon}>🔐</div>
          <h1 className={s.deniedTitle}>{i18nStore.t('add.deniedTitle')}</h1>
          <p className={s.deniedText}>
            {i18nStore.t('add.deniedText')}
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => eventsStore.setRole('admin')}
          >
            {i18nStore.t('add.deniedButton')}
          </button>
        </div>
      </div>
    )
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as EventCategory | '',
    city: 'Tbilisi',
    address: '',
    date: '',
    time: '',
    price: '',
    spots: '',
    organizer: '',
    payOnSite: true,
    payDirect: false,
    bankName: '',
    bankRecipient: '',
    bankAccount: '',
  })
  const [imageUrl, setImageUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const base64 = await compressImage(file)
      setImageUrl(base64)
    } catch {
      alert('Failed to compress image')
    }
  }, [])

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleImageUpload(file)
  }

  const isValid =
    form.title.trim() &&
    form.category &&
    form.date &&
    form.time &&
    form.address.trim() &&
    form.organizer.trim() &&
    (form.payOnSite || (form.payDirect && form.bankName.trim() && form.bankRecipient.trim() && form.bankAccount.trim()))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)
    const id = eventsStore.addEvent({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category as EventCategory,
      city: form.city,
      address: form.address.trim(),
      date: form.date,
      time: form.time,
      price: Number(form.price) || 0,
      spots: Number(form.spots) || 20,
      imageUrl: imageUrl || '/images/event_wine.png',
      organizer: form.organizer.trim(),
      payOnSite: form.payOnSite,
      payDirect: form.payDirect,
      bankDetails: form.payDirect ? {
        bankName: form.bankName.trim(),
        recipient: form.bankRecipient.trim(),
        account: form.bankAccount.trim(),
      } : undefined
    })
    navigate(`/event/${id}`)
  }

  return (
    <div className={s.page}>
      <div className="container">
        <div className={s.header}>
          <h1 className={s.pageTitle}>{i18nStore.t('add.title')}</h1>
          <p className={s.pageSub}>{i18nStore.t('add.subtitle')}</p>
        </div>

        <form className={s.card} onSubmit={handleSubmit}>

          {/* Title */}
          <div className={s.fieldGroup}>
            <label className={s.label}>{i18nStore.t('add.nameLabel')}</label>
            <input
              className={s.input}
              placeholder={i18nStore.t('add.namePlaceholder')}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className={s.fieldGroup}>
            <label className={s.label}>{i18nStore.t('add.catLabel')}</label>
            <div className={s.chips}>
              {CATEGORIES.map((catKey) => (
                <button
                  type="button"
                  key={catKey}
                  className={`${s.chip} ${form.category === catKey ? s.chipActive : ''}`}
                  onClick={() => set('category', catKey)}
                >
                  {i18nStore.t('categories.' + catKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={s.fieldGroup}>
            <label className={s.label}>{i18nStore.t('add.descLabel')}</label>
            <textarea
              className={s.textarea}
              placeholder={i18nStore.t('add.descPlaceholder')}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Date + Time */}
          <div className={s.row}>
            <div className={s.fieldGroup}>
              <label className={s.label}>{i18nStore.t('add.dateLabel')}</label>
              <DatePicker
                value={form.date}
                onChange={(val) => set('date', val)}
                minDate={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>{i18nStore.t('add.timeLabel')}</label>
              <TimePicker
                value={form.time}
                onChange={(val) => set('time', val)}
                required
              />
            </div>
          </div>

          {/* City + Address */}
          <div className={s.row}>
            <div className={s.fieldGroup}>
              <label className={s.label}>{i18nStore.t('add.cityLabel')}</label>
              <select
                className={s.select}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {i18nStore.t('cities.' + c)}
                  </option>
                ))}
              </select>
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>{i18nStore.t('add.addressLabel')}</label>
              <input
                className={s.input}
                placeholder={i18nStore.t('add.addressPlaceholder')}
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Price + Spots */}
          <div className={s.row}>
            <div className={s.fieldGroup}>
              <label className={s.label}>{i18nStore.t('add.priceLabel')}</label>
              <input
                type="number"
                className={s.input}
                min={0}
                placeholder={i18nStore.t('add.pricePlaceholder')}
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>{i18nStore.t('add.spotsLabel')}</label>
              <input
                type="number"
                className={s.input}
                min={1}
                placeholder={i18nStore.t('add.spotsPlaceholder')}
                value={form.spots}
                onChange={(e) => set('spots', e.target.value)}
              />
            </div>
          </div>

          {/* Photo upload */}
          <div className={s.fieldGroup}>
            <label className={s.label}>{i18nStore.t('add.photoLabel')}</label>
            {imageUrl ? (
              <div className={s.previewWrap}>
                <img src={imageUrl} alt="preview" className={s.preview} />
                <button
                  type="button"
                  className={s.removeImg}
                  onClick={() => setImageUrl('')}
                  title="Remove photo"
                >✕</button>
              </div>
            ) : (
              <div
                className={s.uploadArea}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={s.uploadIcon}>📷</div>
                <div className={s.uploadText}>{i18nStore.t('add.photoHint')}</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={s.uploadInput}
                  onChange={handleFilePick}
                />
              </div>
            )}
          </div>

          {/* Organizer */}
          <div className={s.fieldGroup}>
            <label className={s.label}>{i18nStore.t('add.organizerLabel')}</label>
            <input
              className={s.input}
              placeholder={i18nStore.t('add.organizerPlaceholder')}
              value={form.organizer}
              onChange={(e) => set('organizer', e.target.value)}
              required
            />
          </div>

          {/* Payment Methods */}
          <div className={s.fieldGroup}>
            <label className={s.label}>{i18nStore.t('add.paymentsLabel')}</label>
            <div className={s.checkboxGroup}>
              <label className={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.payOnSite}
                  onChange={(e) => set('payOnSite', e.target.checked)}
                />
                <span>{i18nStore.t('add.onsiteLabel')}</span>
              </label>
              <label className={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.payDirect}
                  onChange={(e) => set('payDirect', e.target.checked)}
                />
                <span>{i18nStore.t('add.directLabel')}</span>
              </label>
            </div>
          </div>

          {form.payDirect && (
            <div className={s.bankSection}>
              <h4 className={s.bankTitle}>{i18nStore.t('add.bankSectionTitle')}</h4>
              <div className={s.row}>
                <div className={s.fieldGroup}>
                  <label className={s.label}>{i18nStore.t('add.bankNameLabel')}</label>
                  <input
                    className={s.input}
                    placeholder="TBC Bank, Bank of Georgia"
                    value={form.bankName}
                    onChange={(e) => set('bankName', e.target.value)}
                    required
                  />
                </div>
                <div className={s.fieldGroup}>
                  <label className={s.label}>{i18nStore.t('add.bankRecipientLabel')}</label>
                  <input
                    className={s.input}
                    placeholder="Name Surname"
                    value={form.bankRecipient}
                    onChange={(e) => set('bankRecipient', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>{i18nStore.t('add.bankAccountLabel')}</label>
                <input
                  className={s.input}
                  placeholder={i18nStore.t('add.bankAccountPlaceholder')}
                  value={form.bankAccount}
                  onChange={(e) => set('bankAccount', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className={s.divider} />

          <button
            type="submit"
            className={s.submitBtn}
            disabled={!isValid || submitting}
          >
            {submitting ? i18nStore.t('add.submittingButton') : i18nStore.t('add.submitButton')}
          </button>
        </form>
      </div>
    </div>
  )
})
