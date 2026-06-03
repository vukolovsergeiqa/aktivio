import { Link, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Plus } from 'lucide-react'
import { eventsStore } from '../../stores/events-store'
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
            <Link to="/add" className="btn-primary">
              <Plus size={16} />
              Добавить
            </Link>
          )}

          <div className={s.roleSwitcher}>
            <button
              type="button"
              className={`${s.roleBtn} ${currentRole === 'guest' ? s.roleBtnActive : ''}`}
              onClick={() => eventsStore.setRole('guest')}
            >
              Гость
            </button>
            <button
              type="button"
              className={`${s.roleBtn} ${currentRole === 'admin' ? s.roleBtnActive : ''}`}
              onClick={() => eventsStore.setRole('admin')}
            >
              Админ
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
})
