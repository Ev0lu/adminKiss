import { useEffect, useState } from 'react'
import s from'./statistic.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getStatistics } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function Statistic() { 
  interface statsData {
    registrations: string,
    total_income: string,
    purchases: string,
    lucky_kiss: string,
    purchased_items: {
        product__id: string,
        product__name: string,
        number_of_items_purchased: string
    }[]
}
  const [statistics, setStatistics] = useState<statsData>()
  const [selectedOption, setSelectedOption] = useState('1');

  const handleOptionChange = (event: React.FormEvent<HTMLInputElement>) => {
      setSelectedOption(event.currentTarget.value);
    };
  const navigate = useNavigate()

  const getAllStats = async () => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };
        const response = await getStatistics(selectedOption, token)
        
        if (response.status === 401) {
        } else {
            const data = await response.json()
            console.log(data)
            setStatistics(data)
        }
    }

    useEffect(() => {
        getAllStats()
    }, [selectedOption])

  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>

            <div className={s.header}>
                <p style={{color: 'black', width: '13%', fontSize: '17px', fontWeight: '600', paddingLeft: '30px', marginBottom:'1px'}}>Сортировка:</p>
                <form className={s.form_wrapper}>
                    <select className={s.formOption} value={selectedOption} onChange={(e:any) => {
                        handleOptionChange(e)
                    }}>
                    <option value="1">Сутки</option>
                    <option value="7">7 дней</option>
                    <option value="14">14 дней</option>
                    <option value="31">Месяц</option>
                    <option value="">Всего</option>
                    </select>
                </form>
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>
           {/* <div className={s.grid_container}>
                <div className={s.grid_item}>Регистраций</div>
                <div className={s.grid_item}>Заработано</div>
                <div className={s.grid_item}>Покупок</div>
                <div className={s.grid_item}>Будка поцелуев</div>
                {statistics ? statistics.purchased_items.map((item: any) => (
                        <div key={item.product__id} className={s.grid_item}>{item.product__name}: {item.number_of_items_purchased}</div>

                )) : '-'}
                </div>*/
                }
            

            <div className={s.grid_container}>
                <div style={{fontSize:'18px'}} className={s.grid_item}>Регистраций: { statistics ? statistics.registrations : '-'}</div>
                <div style={{fontSize:'18px'}} className={s.grid_item}>Заработано: { statistics ? statistics.total_income : '-'}р</div>
                <div style={{fontSize:'18px'}} className={s.grid_item}>Покупок: { statistics ? statistics.purchases : '-'}</div>
                <div style={{fontSize:'18px'}} className={s.grid_item}>Будка поцелуев: { statistics ? statistics.lucky_kiss : '-'}</div>
                {statistics ? statistics.purchased_items.map((item: any) => (
                        <div key={item.product__id} className={s.grid_item}>{item.product__name}: {item.number_of_items_purchased}</div>

                )) : '-'}
                {/*<div className={s.grid_item}>Подушки 50шт</div>
                <div className={s.grid_item}>Салфетки 12</div>
                <div className={s.grid_item}>Крем 15 шт</div>*/}
            </div>     
        </div>
    </div>
)
}

export default Statistic
