import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { eventsStore } from '../../stores/events-store'
import { CATEGORY_LABELS, CITIES } from '../../types'
import type { EventCategory } from '../../types'
import s from './AddEventPage.module.css'

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS) as [EventCategory, string][]

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
          <h1 className={s.deniedTitle}>Доступ ограничен</h1>
          <p className={s.deniedText}>
            Этот раздел доступен только для администраторов. Чтобы добавить мероприятие, переключитесь в режим администратора.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => eventsStore.setRole('admin')}
          >
            Войти как администратор
          </button>
        </div>
      </div>
    )
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as EventCategory | '',
    city: 'Тбилиси',
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
      alert('Не удалось загрузить изображение')
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
          <h1 className={s.pageTitle}>Добавить мероприятие</h1>
          <p className={s.pageSub}>Заполните информацию о вашем событии</p>
        </div>

        <form className={s.card} onSubmit={handleSubmit}>

          {/* Title */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Название *</label>
            <input
              className={s.input}
              placeholder="Например: Мастер-класс по грузинской кухне"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Категория *</label>
            <div className={s.chips}>
              {ALL_CATEGORIES.map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  className={`${s.chip} ${form.category === key ? s.chipActive : ''}`}
                  onClick={() => set('category', key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Описание</label>
            <textarea
              className={s.textarea}
              placeholder="Расскажите подробнее о мероприятии..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Date + Time */}
          <div className={s.row}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Дата *</label>
              <input
                type="date"
                className={s.input}
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => set('date', e.target.value)}
                required
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Время *</label>
              <input
                type="time"
                className={s.input}
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
                required
              />
            </div>
          </div>

          {/* City + Address */}
          <div className={s.row}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Город</label>
              <select
                className={s.select}
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Адрес *</label>
              <input
                className={s.input}
                placeholder="ул. Руставели, 10"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Price + Spots */}
          <div className={s.row}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Цена (₾) — 0 = бесплатно</label>
              <input
                type="number"
                className={s.input}
                min={0}
                placeholder="50"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Количество мест</label>
              <input
                type="number"
                className={s.input}
                min={1}
                placeholder="20"
                value={form.spots}
                onChange={(e) => set('spots', e.target.value)}
              />
            </div>
          </div>

          {/* Photo upload */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Фото мероприятия</label>
            {imageUrl ? (
              <div className={s.previewWrap}>
                <img src={imageUrl} alt="preview" className={s.preview} />
                <button
                  type="button"
                  className={s.removeImg}
                  onClick={() => setImageUrl('')}
                  title="Удалить фото"
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
                <div className={s.uploadText}>Перетащите фото или нажмите для выбора</div>
                <div className={s.uploadHint}>PNG, JPG до 10 МБ — сжимается автоматически</div>
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
            <label className={s.label}>Имя организатора *</label>
            <input
              className={s.input}
              placeholder="Ваше имя или название студии"
              value={form.organizer}
              onChange={(e) => set('organizer', e.target.value)}
              required
            />
          </div>

          {/* Payment Methods */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Способы оплаты (выберите хотя бы один) *</label>
            <div className={s.checkboxGroup}>
              <label className={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.payOnSite}
                  onChange={(e) => set('payOnSite', e.target.checked)}
                />
                <span>Оплата на месте</span>
              </label>
              <label className={s.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.payDirect}
                  onChange={(e) => set('payDirect', e.target.checked)}
                />
                <span>Прямой перевод организатору (TBC / BoG / телефон)</span>
              </label>
            </div>
          </div>

          {form.payDirect && (
            <div className={s.bankSection}>
              <h4 className={s.bankTitle}>Реквизиты для перевода</h4>
              <div className={s.row}>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Название банка *</label>
                  <input
                    className={s.input}
                    placeholder="Например: TBC Bank, Bank of Georgia"
                    value={form.bankName}
                    onChange={(e) => set('bankName', e.target.value)}
                    required
                  />
                </div>
                <div className={s.fieldGroup}>
                  <label className={s.label}>Получатель *</label>
                  <input
                    className={s.input}
                    placeholder="Имя Фамилия получателя"
                    value={form.bankRecipient}
                    onChange={(e) => set('bankRecipient', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Номер счета (IBAN) или телефон *</label>
                <input
                  className={s.input}
                  placeholder="GE79BG... или +995..."
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
            {submitting ? 'Публикуем...' : 'Опубликовать мероприятие'}
          </button>
        </form>
      </div>
    </div>
  )
})
