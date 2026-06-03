import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { i18nStore } from '../../stores/i18n-store'
import { CITIES } from '../../types'
import s from './CitySelect.module.css'

interface CitySelectProps {
  value: string
  onChange: (value: string) => void
  showAllOption?: boolean
  variant?: 'pill' | 'box'
}

export const CitySelect = observer(({ value, onChange, showAllOption = false, variant = 'box' }: CitySelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const getLabel = () => {
    if (value === 'all') {
      return i18nStore.t('home.allCities')
    }
    return i18nStore.t('cities.' + value)
  }

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div className={`${s.wrapper} ${variant === 'pill' ? s.wrapperPill : ''}`} ref={containerRef}>
      <button
        type="button"
        className={`${s.trigger} ${variant === 'pill' ? s.triggerPill : s.triggerBox} ${isOpen ? s.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={s.labelText}>{getLabel()}</span>
        <span className={s.arrow}>▼</span>
      </button>

      {isOpen && (
        <div className={`${s.popover} ${variant === 'pill' ? s.popoverPill : s.popoverBox}`}>
          {showAllOption && (
            <button
              type="button"
              className={`${s.option} ${value === 'all' ? s.optionActive : ''}`}
              onClick={() => handleSelect('all')}
            >
              {i18nStore.t('home.allCities')}
            </button>
          )}
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`${s.option} ${value === c ? s.optionActive : ''}`}
              onClick={() => handleSelect(c)}
            >
              {i18nStore.t('cities.' + c)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
