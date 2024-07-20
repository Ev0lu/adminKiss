import { useNavigate } from 'react-router-dom'
import s from './navbar.module.css'


function Navbar() {
  const navigate = useNavigate()

  return (        
    <div className={s.navbar}>
        <div className={s.navbar_side_wrapper}>
            <div onClick={() => navigate('/stats')} className={s.navbar_item}>
                <p>Статистика</p>
            </div>
            <div onClick={() => navigate('/orders')} className={s.navbar_item}>
                <p>Заказы</p>
            </div>
            <div className={s.navbar_item}>
                <p>Будка поцелуев</p>
            </div>
            <div onClick={() => navigate('/special_offers')} className={s.navbar_item}>
                <p>Акции</p>
            </div>
            <div onClick={() => navigate('/admin_logs')} className={s.navbar_item}>
                <p>Логи администратора</p>
            </div>
        </div>
    </div>
  )
}

export default Navbar
