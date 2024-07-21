import { useLocation, useNavigate } from 'react-router-dom'
import s from './navbar.module.css'


function Navbar() {
  const navigate = useNavigate()
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;


  return (        
    <div className={s.navbar}>
        <div className={s.navbar_side_wrapper}>
            <div onClick={() => navigate('/stats')} className={`${s.navbar_item} ${isActive('/stats') ? s.active : ''}`}>
                <p>Статистика</p>
            </div>
            <div onClick={() => navigate('/orders')} className={`${s.navbar_item} ${isActive('/orders') ? s.active : ''}`}>
                <p>Заказы</p>
            </div>
            <div onClick={() => navigate('/kisses')} className={`${s.navbar_item} ${isActive('/kisses') ? s.active : ''}`}>
                <p>Будка поцелуев</p>
            </div>
            <div onClick={() => navigate('/special_offers')} className={`${s.navbar_item} ${isActive('/special_offers') ? s.active : ''}`}>
                <p>Акции</p>
            </div>
            <div className={s.navbar_item}>
                <p>Баннеры и сторис</p>
            </div>
            <div className={s.navbar_item}>
                <p>Медитации</p>
            </div>
            <div className={s.navbar_item}>
                <p>Аккаунты</p>
            </div>
            <div onClick={() => navigate('/admin_logs')} className={`${s.navbar_item} ${isActive('/admin_logs') ? s.active : ''}`}>
                <p>Логи администратора</p>
            </div>
            <div className={s.navbar_item}>
                <p>Послать пуш-уведомление</p>
            </div>
        </div>
    </div>
  )
}

export default Navbar
