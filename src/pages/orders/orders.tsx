import { useState } from 'react'
import s from'./orders.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getOrderById, getOrderByStatus } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function Orders() { 
  interface statsData {
    code: string,
    date_created: string,
    delivery_city_name: string | null,
    products: any[],
    recipient_email: string,
    recipient_name: string,
    recipient_phone_number: string,
    status: string,
    delivery_point_name: string,
    delivery_service: string,
    final_price: number

}
  const [order, setOrders] = useState<statsData[]>()
  const [orderById, setOrderById] = useState<statsData>()

  const [orderInfo, setOrderInfo] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const navigate = useNavigate()

  const getOrder = async () => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
       let response: any;
        if (orderStatus === '' && orderInfo !== '') {
            response = await getOrderById(orderInfo, token)
            const data = await response.json()
            setOrderById(data)
            setOrders([])
        } else {
            response = await getOrderByStatus(orderStatus, orderInfo, token)
            const data = await response.json()
            setOrders(data)
        }

    }

    const [selectedItemId, setSelectedItemId] = useState('')
    const [orderSelectedInfo, setOrderSelectedInfo] = useState<any>()
    const selectedOrder = async (id: string) => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
        const response = await getOrderById(id, token)
        const data = await response.json()
        console.log(data)
        setOrderSelectedInfo(data)

    }


  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>
            <div className={s.header}>
                    <input placeholder='Номер телефона или № заказа' className={s.formOption} value={orderInfo} onChange={(e:any) => {
                        setSelectedItemId('')
                        setOrderInfo(e.target.value)
                    }} />
                    <input placeholder='Введите статус заказа' className={s.formOption} value={orderStatus} onChange={(e:any) => {
                        setSelectedItemId('')
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
            <div className={s.grid_container_about}>
                    <div className={s.grid_item}>№ заказа:</div>
                    <div className={s.grid_item}>Телефон:</div>
                    <div className={s.grid_item}>Имя:</div>
                    <div className={s.grid_item}>Почта:</div>
                    <div className={s.grid_item}>Сервис доставки:</div>
                    <div className={s.grid_item}>Цена:</div>
                    <div className={s.grid_item}></div>
            </div>  

            {order && order.map((order: any) => (
                <>
                    <div  className={`${s.grid_container}`}> 
                            <div className={s.grid_item}>{order.code}</div>
                            <div className={s.grid_item}>{order.recipient_phone_number ? order.recipient_phone_number : '-'}</div>
                            <div className={s.grid_item}>{order.recipient_name ? order.recipient_name : '-'}</div>
                            <div className={s.grid_item}>{order.recipient_email ? order.recipient_email : '-'}</div>
                            <div className={s.grid_item}>{order.delivery_service ? order.delivery_service : '-'}</div>
                            <div className={s.grid_item}>{order.final_price}</div>
                            <div onClick={() => {
                                if (selectedItemId !== ''){
                                    if (order.code === selectedItemId) {
                                        setSelectedItemId('')

                                    } else {
                                        setSelectedItemId(order.code)
                                    }


                                } else {
                                    setSelectedItemId(order.code)
                                }

                                selectedOrder(order.code)


                            }} style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}} className={s.grid_item}>Подробнее {order.code === selectedItemId ? '↓' : '↑'}
                        </div>
                        </div>
                    <div  className={`${s.grid_container_about_more} ${order ? order.code === selectedItemId ? s.active : s.unactive : ''}`}>
                        <div className={s.grid_container_about_more_wrapper}>
                                <div className={s.grid_item}>ID Продукта:</div>
                                <div className={s.grid_item}>Название:</div>
                                <div className={s.grid_item}>Изображение:</div>

                        </div>  

                       <div className={s.grid_item_more}>{orderSelectedInfo?.products && orderSelectedInfo.products.map((item:any) => (
                            <div key={item.id} style={{display: 'flex', gap: '50px', fontWeight: '400', alignItems: 'center'
                            }} className="product-item">
                                <span className="product-id" style={{width: '15%'}}>{item.id}</span>
                                <span className="product-id" style={{width: '685px'}} >{item.name}</span>

                                <img className="product-image" style={{height: '50px', width: '50px'}} src={item.image} alt={'-'} />
                              </div>
                       ))}</div>

                    </div>  
                </>

                    ))}
                <>
             <div className={s.grid_container}>
         
                    <div className={s.grid_item}>№ {orderById ? orderById.code : '-'}</div>
                    <div className={s.grid_item}>{orderById ? orderById.recipient_phone_number : '-'}</div>
                    <div className={s.grid_item}>{orderById ? orderById.recipient_name : '-'}</div>
                    <div className={s.grid_item}>{orderById ? orderById.recipient_email : '-'}</div>
                    <div className={s.grid_item}>{orderById ? orderById.delivery_service : '-'}</div>
                    <div className={s.grid_item}>-</div>
                    <div onClick={() => {
                            if (selectedItemId !== '' ) {
                                setSelectedItemId('')
                            }else {
                                orderById && selectedOrder(orderById.code)
                                setSelectedItemId(orderById ? orderById.code : '')
                            }
                        }} style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}} className={s.grid_item}>Подробнее {orderById ? orderById.code === selectedItemId ? '↓' : '↑'  : ''}</div>

             </div>  
             <div  className={`${s.grid_container_about_more} ${orderById ? orderById.code === selectedItemId ? s.active : s.unactive : s.unactive}`}>
                    <div className={`${s.grid_container_about_more_wrapper}`}>
                            <div className={s.grid_item}>ID Продукта:</div>
                            <div className={s.grid_item}>Название:</div>
                            <div className={s.grid_item}>Изображение:</div>
                    </div> 
                    <div className={s.grid_item_more}>{orderSelectedInfo?.products && orderSelectedInfo.products.map((item:any) => (
                        
                            <div style={{display: 'flex', gap: '50px', fontWeight: '400', alignItems: 'center'
                            }} className="product-item">
                              <span className="product-id" style={{width: '15%'}}>{item.id}</span>
                                <span className="product-id" style={{width: '685px'}} >{item.name}</span>

                                <img className="product-image" style={{height: '50px', width: '50px'}} src={item.image} alt={'-'} />
                              </div>
                       ))}</div>

                    </div>  
            </>   
        </div>
    </div>
)
}

export default Orders
