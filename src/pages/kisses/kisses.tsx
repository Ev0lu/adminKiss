import { useEffect, useState } from 'react'
import s from'./kisses.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getKisses } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';
import backGif from '../../assets/blackink.gif'


function Kisses() { 
  interface kissData {
    type: string,
    discount_percentage?: number,
    product?: string,
    last_order: any,
    user_name: string,
    user_phone: string

}
  const [kisses, setKisses] = useState<kissData[]>()

  const navigate = useNavigate()

  const getKissesList = async () => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };

        const response = await getKisses(token)
        const data = await response.json()
        console.log(data)
        setKisses(data)
    }

    useEffect(() => {
        getKissesList()
    }, [])

  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>
            <div className={s.backgroundGif}>
                        <img src={backGif}></img>
                </div>
            <div className={s.header}>
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>
            <div className={s.main}>

            </div>
            {kisses && kisses.map((kiss: kissData) => (
                    <div className={s.grid_container}>

                        <div className={s.grid_item}>Тип: {kiss.type}</div>
                        <div className={s.grid_item}>{kiss.discount_percentage ? kiss.discount_percentage + '%' : kiss.product ? kiss.product : '-'}</div>
                        <div className={s.grid_item}>{kiss.last_order ? kiss.last_order : '-'}</div>
                        <div className={s.grid_item}>{kiss.user_name ? kiss.user_name : '-'}</div>
                        <div className={s.grid_item}>{kiss.user_phone ? kiss.user_phone : '-'}</div>
                    </div>

                    ))}
    
        </div>
    </div>
)
}

export default Kisses
