import { useEffect, useState } from 'react'
import s from'./special-offer.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getStatistics } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function SpecialOffers() { 
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
  const [selectedOption, setSelectedOption] = useState('14');

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


  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>
            <div className={s.header}>
                <div className={s.title}>
                    <h1>Промо</h1>
                </div>
   
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>

            <div className={s.main}>
                <div className={s.main_specialOffer}>
                    <div className={s.registrationForm_button_wrapper_main}>
                        <button onClick={() => {

                        }} className={s.registrationForm_button_main}>Выйти</button>
                    </div>
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedOption} onChange={(e:any) => {
                            handleOptionChange(e)
                        }}>
                        <option value="14">Всего</option>
                        <option value="31">Месяц</option>
                        <option value="7">7 дней</option>
                        <option value="1">Сутки</option>
                        </select>
                    </form>
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedOption} onChange={(e:any) => {
                            handleOptionChange(e)
                        }}>
                        <option value="14">Всего</option>
                        <option value="31">Месяц</option>
                        <option value="7">7 дней</option>
                        <option value="1">Сутки</option>
                        </select>
                    </form>

                </div>
                <div className={s.main_promocode}>
                    <div className={s.registrationForm_button_wrapper_main}>
                        <button onClick={() => {

                        }} className={s.registrationForm_button_main}>Выйти</button>
                    </div>
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedOption} onChange={(e:any) => {
                            handleOptionChange(e)
                        }}>
                        <option value="14">Всего</option>
                        <option value="31">Месяц</option>
                        <option value="7">7 дней</option>
                        <option value="1">Сутки</option>
                        </select>
                    </form>
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedOption} onChange={(e:any) => {
                            handleOptionChange(e)
                        }}>
                        <option value="14">Всего</option>
                        <option value="31">Месяц</option>
                        <option value="7">7 дней</option>
                        <option value="1">Сутки</option>
                        </select>
                    </form>
                </div>
                <div className={s.main_stats}>
                        <h2>Промо</h2>
                </div>
                
            </div>   
        </div>
    </div>
)
}

export default SpecialOffers
