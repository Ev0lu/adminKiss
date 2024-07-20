import { useEffect, useState } from 'react'
import s from'./orders.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getOrderById, getOrderByStatus, getOrdersStatuses } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function Orders() { 
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
  const [order, setOrders] = useState<statsData>()
  const [orderInfo, setOrderInfo] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const navigate = useNavigate()

  const getOrder = async () => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
       /* let response: any;
        if (orderStatus === '') {
            response = await getOrderById(orderInfo, token)

        } else if (orderStatus !== '') {
            response = await getOrderByStatus(orderStatus, orderInfo, token)
 
        }*/
        const response = await getOrdersStatuses(token)
        const data = await response.json()
        console.log(data)

       /* if (response.status === 401) {
        } else {
            const data = await response.json()
            console.log(data)

        }*/
    }

  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>
            <div className={s.header}>
                <div className={s.title}>
                    <h1>Заказы</h1>
                </div>
                    <input placeholder='Номер телефона или № заказа' className={s.formOption} value={orderInfo} onChange={(e:any) => {
                        setOrderInfo(e.target.value)
                    }} />
                    <input placeholder='Введите статус заказа' className={s.formOption} value={orderStatus} onChange={(e:any) => {
                        setOrderStatus(e.target.value)
                    }} />
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        getOrder()
                    }} className={s.registrationForm_button_find_orders}>Найти заказ</button>
                </div>

                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>
            <div className={s.grid_container}>
                <div className={s.grid_item}>Регистраций: { order ? order.registrations : '-'}</div>
                <div className={s.grid_item}>Заработано: { order ? order.total_income : '-'}р</div>
                <div className={s.grid_item}>Покупок: { order ? order.purchases : '-'}</div>
                <div className={s.grid_item}>Будка поцелуев: { order ? order.lucky_kiss : '-'}</div>
                <div className={s.grid_item}>Заработано: { order ? order.total_income : '-'}р</div>
                <div className={s.grid_item}>Покупок: { order ? order.purchases : '-'}</div>
                <div className={s.grid_item}>Подробнее { order ? order.lucky_kiss : '-'}</div>

                {/*<div className={s.grid_item}>Подушки 50шт</div>
                <div className={s.grid_item}>Салфетки 12</div>
                <div className={s.grid_item}>Крем 15 шт</div>*/}
            </div>     
        </div>
    </div>
)
}

export default Orders
