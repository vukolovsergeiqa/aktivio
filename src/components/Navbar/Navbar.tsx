import { Link, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Plus } from 'lucide-react'
import { eventsStore } from '../../stores/events-store'
import { i18nStore } from '../../stores/i18n-store'
import s from './Navbar.module.css'

export const Navbar = observer(() => {
  const location = useLocation()
  const isAdd = location.pathname === '/add'
  const { currentRole } = eventsStore

  return (
    <header className={s.navbar}>
      <div className={`container ${s.inner}`}>
        <Link to="/" className={s.logo}>Aktivio</Link>

        <nav className={s.nav}>
          {!isAdd && currentRole === 'admin' && (
            <Link to="/add" className={`${s.addBtn} btn-primary`}>
              <Plus size={16} />
              <span className={s.addText}>{i18nStore.t('nav.add')}</span>
            </Link>
          )}

          <div className={s.roleSwitcher}>
            <button
              type="button"
              className={`${s.roleBtn} ${currentRole === 'guest' ? s.roleBtnActive : ''}`}
              onClick={() => eventsStore.setRole('guest')}
            >
              {i18nStore.t('nav.roleGuest')}
            </button>
            <button
              type="button"
              className={`${s.roleBtn} ${currentRole === 'admin' ? s.roleBtnActive : ''}`}
              onClick={() => eventsStore.setRole('admin')}
            >
              {i18nStore.t('nav.roleAdmin')}
            </button>
          </div>

          <div className={s.langSwitcher}>
            <button
              type="button"
              className={`${s.langBtn} ${i18nStore.currentLang === 'en' ? s.langBtnActive : ''}`}
              onClick={() => i18nStore.setLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`${s.langBtn} ${i18nStore.currentLang === 'ru' ? s.langBtnActive : ''}`}
              onClick={() => i18nStore.setLanguage('ru')}
            >
              RU
            </button>
            <button
              type="button"
              className={`${s.langBtn} ${i18nStore.currentLang === 'ka' ? s.langBtnActive : ''}`}
              onClick={() => i18nStore.setLanguage('ka')}
            >
              GE
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
})
