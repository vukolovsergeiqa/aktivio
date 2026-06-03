import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { i18nStore } from '../../stores/i18n-store'
import s from './DatePicker.module.css'

interface DatePickerProps {
  value: string // 'YYYY-MM-DD'
  onChange: (value: string) => void
  required?: boolean
  minDate?: string // 'YYYY-MM-DD'
}

export const DatePicker = observer(({ value, onChange, required = false, minDate }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse current date or default to today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const parsedValue = value ? new Date(value) : null
  if (parsedValue) parsedValue.setHours(0, 0, 0, 0)

  // Calendar navigation state (month/year we are currently viewing in the grid)
  const [viewDate, setViewDate] = useState(() => {
    if (parsedValue) return new Date(parsedValue)
    return new Date()
  })

  // Sync viewDate when value changes from outside
  useEffect(() => {
    if (parsedValue) {
      setViewDate(new Date(parsedValue))
    }
  }, [value])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Get locale string for browser DateTimeFormat
  const getLocale = () => {
    if (i18nStore.currentLang === 'ka') return 'ka-GE'
    if (i18nStore.currentLang === 'ru') return 'ru-RU'
    return 'en-US'
  }

  // Formatting date for the input button
  const formatSelectedDate = () => {
    if (!parsedValue) {
      return i18nStore.currentLang === 'ka' ? 'აირჩიეთ თარიღი' : i18nStore.currentLang === 'ru' ? 'Выберите дату' : 'Select date'
    }
    return new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(parsedValue)
  }

  // Calendar calculation functions
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7 // Start on Monday
  const prevMonthDays = new Date(year, month, 0).getDate()

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleSelectDay = (day: number, currentMonthOffset = 0) => {
    const selected = new Date(year, month + currentMonthOffset, day)
    // Format to YYYY-MM-DD manually keeping local timezone date
    const y = selected.getFullYear()
    const m = String(selected.getMonth() + 1).padStart(2, '0')
    const d = String(selected.getDate()).padStart(2, '0')
    onChange(`${y}-${m}-${d}`)
    setIsOpen(false)
  }

  // Generate weekday headers
  const getWeekdays = () => {
    const locale = getLocale()
    // Start with a Monday
    const baseDate = new Date(2026, 5, 1) // June 1st, 2026 is Monday
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate)
      d.setDate(baseDate.getDate() + i)
      const dayLabel = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d)
      days.push(dayLabel.substring(0, 3)) // Take first 3 chars
    }
    return days
  }

  // Check if a specific date is disabled
  const isDateDisabled = (day: number, monthOffset = 0) => {
    const checkDate = new Date(year, month + monthOffset, day)
    checkDate.setHours(0, 0, 0, 0)

    if (minDate) {
      const minLimit = new Date(minDate)
      minLimit.setHours(0, 0, 0, 0)
      return checkDate < minLimit
    }
    return checkDate < today
  }

  // Render day cells
  const renderCells = () => {
    const cells = []

    // 1. Previous month days (faded)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      cells.push(
        <button
          key={`prev-${day}`}
          type="button"
          className={`${s.cell} ${s.otherMonth}`}
          onClick={() => handleSelectDay(day, -1)}
          disabled={isDateDisabled(day, -1)}
        >
          {day}
        </button>
      )
    }

    // 2. Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = parsedValue && 
        parsedValue.getDate() === day && 
        parsedValue.getMonth() === month && 
        parsedValue.getFullYear() === year

      const isToday = today.getDate() === day && 
        today.getMonth() === month && 
        today.getFullYear() === year

      cells.push(
        <button
          key={`curr-${day}`}
          type="button"
          className={`${s.cell} ${isSelected ? s.selected : ''} ${isToday ? s.today : ''}`}
          onClick={() => handleSelectDay(day, 0)}
          disabled={isDateDisabled(day, 0)}
        >
          {day}
        </button>
      )
    }

    // 3. Next month days to fill 42 cells grid
    const totalCells = cells.length
    const nextDaysNeeded = 42 - totalCells
    for (let day = 1; day <= nextDaysNeeded; day++) {
      cells.push(
        <button
          key={`next-${day}`}
          type="button"
          className={`${s.cell} ${s.otherMonth}`}
          onClick={() => handleSelectDay(day, 1)}
          disabled={isDateDisabled(day, 1)}
        >
          {day}
        </button>
      )
    }

    return cells
  }

  const monthName = new Intl.DateTimeFormat(getLocale(), { month: 'long', year: 'numeric' }).format(viewDate)

  return (
    <div className={s.wrapper} ref={containerRef}>
      <button
        type="button"
        className={`${s.trigger} ${isOpen ? s.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="grid"
        aria-expanded={isOpen}
      >
        <span className={s.icon}>📅</span>
        <span className={value ? s.dateValue : s.placeholderText}>{formatSelectedDate()}</span>
        <span className={s.arrow}>▼</span>
      </button>

      {isOpen && (
        <div className={s.popover}>
          <div className={s.header}>
            <button type="button" className={s.navBtn} onClick={handlePrevMonth}>
              ◀
            </button>
            <div className={s.monthTitle}>{monthName}</div>
            <button type="button" className={s.navBtn} onClick={handleNextMonth}>
              ▶
            </button>
          </div>

          <div className={s.weekdays}>
            {getWeekdays().map((day, idx) => (
              <div key={`wk-${idx}`} className={s.weekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={s.grid}>{renderCells()}</div>
        </div>
      )}

      {/* Hidden input to satisfy HTML form validity if required */}
      {required && (
        <input
          type="hidden"
          value={value}
          required
          aria-hidden="true"
        />
      )}
    </div>
  )
})
