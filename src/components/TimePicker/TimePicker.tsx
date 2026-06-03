import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { i18nStore } from '../../stores/i18n-store'
import s from './TimePicker.module.css'

interface TimePickerProps {
  value: string // 'HH:MM'
  onChange: (value: string) => void
  required?: boolean
}

const PRESETS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

export const TimePicker = observer(({ value, onChange, required = false }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hoursRef = useRef<HTMLDivElement>(null)
  const minutesRef = useRef<HTMLDivElement>(null)

  // Split selected value
  const [hourStr, minuteStr] = value ? value.split(':') : ['', '']
  const selectedHour = hourStr ? parseInt(hourStr, 10) : null
  const selectedMinute = minuteStr ? parseInt(minuteStr, 10) : null

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Auto-scroll lists to active item when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (selectedHour !== null && hoursRef.current) {
          const activeEl = hoursRef.current.querySelector(`[data-hour="${selectedHour}"]`) as HTMLElement
          if (activeEl) {
            hoursRef.current.scrollTop = activeEl.offsetTop - hoursRef.current.offsetTop - 60
          }
        }
        if (selectedMinute !== null && minutesRef.current) {
          const activeEl = minutesRef.current.querySelector(`[data-minute="${selectedMinute}"]`) as HTMLElement
          if (activeEl) {
            minutesRef.current.scrollTop = activeEl.offsetTop - minutesRef.current.offsetTop - 60
          }
        }
      }, 50)
    }
  }, [isOpen, selectedHour, selectedMinute])

  const handlePresetSelect = (time: string) => {
    onChange(time)
    setIsOpen(false)
  }

  const handleCustomSelect = (hour: number | null, minute: number | null) => {
    const h = hour !== null ? hour : (selectedHour !== null ? selectedHour : 12)
    const m = minute !== null ? minute : (selectedMinute !== null ? selectedMinute : 0)
    
    const formattedHour = String(h).padStart(2, '0')
    const formattedMinute = String(m).padStart(2, '0')
    onChange(`${formattedHour}:${formattedMinute}`)
  }

  const getLabel = () => {
    if (!value) {
      return i18nStore.currentLang === 'ka' ? 'აირჩიეთ დრო' : i18nStore.currentLang === 'ru' ? 'Выберите время' : 'Select time'
    }
    return value
  }

  const handleDone = () => {
    // If no value set yet, default to 12:00
    if (!value) {
      onChange('12:00')
    }
    setIsOpen(false)
  }

  // Generate lists
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5) // 0, 5, 10, ... 55

  // Localized texts
  const tPreset = i18nStore.currentLang === 'ka' ? 'სწრაფი არჩევა' : i18nStore.currentLang === 'ru' ? 'Быстрый выбор' : 'Quick Presets'
  const tCustom = i18nStore.currentLang === 'ka' ? 'ზუსტი დრო' : i18nStore.currentLang === 'ru' ? 'Точное время' : 'Custom Time'
  const tDone = i18nStore.currentLang === 'ka' ? 'მზადაა' : i18nStore.currentLang === 'ru' ? 'Готово' : 'Done'

  return (
    <div className={s.wrapper} ref={containerRef}>
      <button
        type="button"
        className={`${s.trigger} ${isOpen ? s.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={s.icon}>🕒</span>
        <span className={value ? s.timeValue : s.placeholderText}>{getLabel()}</span>
        <span className={s.arrow}>▼</span>
      </button>

      {isOpen && (
        <div className={s.popover}>
          {/* Quick Presets Section */}
          <div className={s.presetsSection}>
            <div className={s.sectionHeader}>{tPreset}</div>
            <div className={s.presetsGrid}>
              {PRESETS.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`${s.presetBtn} ${value === time ? s.presetBtnActive : ''}`}
                  onClick={() => handlePresetSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className={s.divider} />

          {/* Custom Time Selection (Hours & Minutes scroll) */}
          <div className={s.customSection}>
            <div className={s.sectionHeader}>{tCustom}</div>
            <div className={s.timeColumns}>
              {/* Hours Column */}
              <div className={s.columnWrapper}>
                <div className={s.columnHeader}>H</div>
                <div className={s.scrollColumn} ref={hoursRef}>
                  {hours.map((h) => {
                    const isHourSelected = selectedHour === h
                    return (
                      <button
                        key={`h-${h}`}
                        type="button"
                        data-hour={h}
                        className={`${s.item} ${isHourSelected ? s.itemActive : ''}`}
                        onClick={() => handleCustomSelect(h, selectedMinute)}
                      >
                        {String(h).padStart(2, '0')}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Minutes Column */}
              <div className={s.columnWrapper}>
                <div className={s.columnHeader}>M</div>
                <div className={s.scrollColumn} ref={minutesRef}>
                  {minutes.map((m) => {
                    const isMinuteSelected = selectedMinute === m
                    return (
                      <button
                        key={`m-${m}`}
                        type="button"
                        data-minute={m}
                        className={`${s.item} ${isMinuteSelected ? s.itemActive : ''}`}
                        onClick={() => handleCustomSelect(selectedHour, m)}
                      >
                        {String(m).padStart(2, '0')}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className={s.footer}>
            <button type="button" className={s.doneBtn} onClick={handleDone}>
              {tDone}
            </button>
          </div>
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
