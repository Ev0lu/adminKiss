import { useEffect, useState } from 'react'
import s from'./admin-logs.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getActionLog, getOrderById, getOrderByStatus, getOrdersStatuses } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function Logs() { 
  interface logsData {
    results:[
        {
            entry_datetime: string,
            admin: string,
            action: string
        


        }[]
    ]
}
  const [logs, setLogs] = useState<logsData>()
  const [logsPage, setLogsPage] = useState('1');

  const navigate = useNavigate()

  const getLogs = async () => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
        const response = await getActionLog(logsPage, '4', token)
        const data = await response.json()
        setLogs(data)
    }

    useEffect(() => {
        getLogs()
    }, [])


  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>
            <div className={s.header}>
                <div className={s.title}>
                    <h1>Заказы</h1>
                </div>
                    <input placeholder='Страница логов' className={s.formOption} value={logsPage} onChange={(e:any) => {
                        setLogsPage(e.target.value)
                    }} />
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        getLogs()
                    }} className={s.registrationForm_button_find_orders}>Получить логи</button>
                </div>

                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>

                {logs ? logs.results.map((item: any, index: number) => (
                    <div className={s.grid_container}>
                        <div key={item.action} className={s.grid_item}>{item.action}</div>
                        <div key={item.admin} className={s.grid_item}>{item.admin}</div>
                        <div key={item.entry_datetime} className={s.grid_item}>{item.entry_datetime}</div>
                    </div>     

                )) : '-'}
                {/*<div className={s.grid_item}>Подушки 50шт</div>
                <div className={s.grid_item}>Салфетки 12</div>
                <div className={s.grid_item}>Крем 15 шт</div>*/}
        </div>
    </div>
)
}

export default Logs
