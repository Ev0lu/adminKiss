import { useEffect, useState } from 'react'
import s from'./accounts.module.css'
import Navbar from '../../shared/navbar/navbar'
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';
import { getAccountById, getAccountOrders, getAccountPromocodes, getAccounts, patchAccount } from '../../shared/api';
import { LazyLoadImage } from "react-lazy-load-image-component";


function Accounts() { 
  interface accountData {
    id: number,
    full_name: string,
    email: string
}

interface accountInfoData {
    phone_number: string,
    email: string,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    lucky_kiss_available: string
}
  const [accounts, setAccounts] = useState<accountData[]>()
  const [, setAccount] = useState<accountInfoData>()
  const [discountList, setDiscountList] = useState<any>([])
  const [orderList, setOrderList] = useState<any>([])


  const [emailSearch, setEmailSearch] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [phoneSearch, setPhoneSearch] = useState('')

  const [flagToChangeProfileInfo, setFlagToChangeProfileInfo] = useState(true)


  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [luckyKissCount, setLuckyKissCount] = useState('')



  const navigate = useNavigate()

  const getAccountsByRequest = async () => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
        const response = await getAccounts(emailSearch, nameSearch, phoneSearch, token)
        const data = await response.json()
        setAccounts(data)
    }

    useEffect(() => {
        getAccountsByRequest()
    }, [])


    const getInfoAboutAccount = async (id: string) => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
        const responseAccountInfoById = await getAccountById(id, token)
        const dataAccountInfoById = await responseAccountInfoById.json()
        setEmail(dataAccountInfoById.email)
        setPhone(dataAccountInfoById.phone_number)
        setName(dataAccountInfoById.first_name)
        setLastName(dataAccountInfoById.last_name)
        setBirthDate(dataAccountInfoById.date_of_birth)
        setLuckyKissCount(dataAccountInfoById.lucky_kiss_available)

        setAccount(dataAccountInfoById)
        
        const responseDiscountInfoById = await getAccountPromocodes(id, token)
        const dataDiscountInfoById = await responseDiscountInfoById.json()
        console.log(dataDiscountInfoById)
        setDiscountList(dataDiscountInfoById)
        const responseOrdersInfoById = await getAccountOrders(id, token)
        const dataOrdersInfoById = await responseOrdersInfoById.json()
        setOrderList(dataOrdersInfoById)
    }

   const patchProfile = async (id: string) => {
        const token = getToken('access'); 
        if (!token) {
            navigate('/')
        };
        const body = {
            "phone_number": phone,
            "email": email,
            "first_name": name,
            "last_name": lastName,
            "date_of_birth": birthDate,
            "lucky_kiss_new_amount": Number(luckyKissCount)
        }
        const response = await patchAccount(body, id, token)
        if (response.status === 200) {
            const data = await response.json() 
            console.log(data)
            getInfoAboutAccount(id)
        }
   }

   const [selectedItemId, setSelectedItemId] = useState(null);
   const [isVisibleOrders, setIsVisibleOrders] = useState(false)
   const [isVisiblePromocodes, setIsVisiblePromocodes] = useState(false)
   const ITEMS_PER_PAGE = 5; // Number of items per page

   const [currentPageOrders, setCurrentPageOrders] = useState(1);
   const [currentPagePromocodes, setCurrentPagePromocodes] = useState(1);

   const handleOrdersPageChange = (newPage: number) => {
    setCurrentPageOrders(newPage);
};

const handlePromocodesPageChange = (newPage: number) => {
    setCurrentPagePromocodes(newPage);
};

const getPaginatedData = (data: any[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
};

const paginatedOrderList = getPaginatedData(orderList, currentPageOrders);
const paginatedDiscountList = getPaginatedData(discountList, currentPagePromocodes);

  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>
            <div className={s.header}>
                    <input placeholder='Поиск по почте' className={s.formOption} value={emailSearch} onChange={(e:any) => {
                        setEmailSearch(e.target.value)
                    }} />
                    <input placeholder='Поиск по имени' className={s.formOption} value={nameSearch} onChange={(e:any) => {
                        setNameSearch(e.target.value)
                    }} />                 
                    <input placeholder='Поиск по номеру телефона' className={s.formOption} value={phoneSearch} onChange={(e:any) => {
                        setPhoneSearch(e.target.value)
                    }} />
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        getAccountsByRequest()
                    }} className={s.registrationForm_button_find_orders}>Найти аккаунт</button>
                </div>

                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>
             <div  style={{width: '96%'}} className={s.grid_wrapper}>
             <div className={s.grid_container_about}>
                        <div className={s.grid_item}>Айди пользователя</div>
                        <div className={s.grid_item}>ФИО</div>
                        <div className={s.grid_item}>Почта</div>
                        <div className={s.grid_item}></div>
                        <div className={s.grid_item}></div>
                    </div>     

                {accounts ? accounts.map((item: any) => (
                    <div >
                    <div key={item.id} className={s.grid_container}>
                        <div className={s.grid_item}>{item.id}</div>
                        <div className={s.grid_item}>{item.full_name}</div>
                        <div className={s.grid_item}>{item.email}</div>
                        <button onClick={() => {
                            setEmail('')
                            setPhone('')
                            setName('')
                            setLastName('')
                            setBirthDate('')
                            setLuckyKissCount('')
                            setDiscountList([])
                            setOrderList([])
                            setIsVisibleOrders(false)
                            setIsVisiblePromocodes(false)
                            setCurrentPageOrders(1);
                            setCurrentPagePromocodes(1)
                            getInfoAboutAccount(item.id)
                            setSelectedItemId(item.id)
 
                          
                            if (item.id === selectedItemId) {
                                setSelectedItemId(null)
                            }

                        }} style={{color: 'white', fontWeight: '300', cursor: 'pointer', width: '150px', marginLeft: '50px'}} className={s.grid_item}>Подробнее {item.id === selectedItemId ? '↓' : '↑'}</button>
                                
                        {flagToChangeProfileInfo ?
                                <div style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}} className={s.grid_item} onClick={() => {
                                setFlagToChangeProfileInfo(false)
                            }}></div>
                        : 
                            <div style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}}  className={s.grid_item} onClick={() => {
                                patchProfile(item.id)
                                setFlagToChangeProfileInfo(true)

                            }}></div> }

                    </div>     

                <div  className={`${s.grid_container_about_more} ${item.id === selectedItemId ? s.active : s.unactive}`}>
                <div className={s.items}>
                    <div className={s.items_wrapper}>
                        <div className={s.about_item}>
                            <div className={s.about_item_text_container}>
                                <p>Номер телефона</p>
                            </div>
                            <input readOnly={flagToChangeProfileInfo} value={phone} onChange={(e) => {
                                setPhone(e.target.value)
                            }} className={s.inputAccount}></input>
                        </div>
                        <div className={s.about_item}>
                            <div className={s.about_item_text_container}>
                                <p>Почта</p>
                            </div>
                            <input readOnly={flagToChangeProfileInfo} value={email} onChange={(e) => {
                                setEmail(e.target.value)
                            }} className={s.inputAccount}></input>
                        </div>
                        <div className={s.about_item}>
                            <div className={s.about_item_text_container}>
                                <p>Имя</p>
                            </div>
                            <input readOnly={flagToChangeProfileInfo} value={name} onChange={(e) => {
                                setName(e.target.value)
                            }} className={s.inputAccount}></input>
                        </div>
                    </div>
                    <div className={s.items_wrapper}>
                            <div className={s.about_item}>
                                <div className={s.about_item_text_container}>
                                    <p>Фамилия</p>
                                </div>
                                <input readOnly={flagToChangeProfileInfo} value={lastName} onChange={(e) => {
                                    setLastName(e.target.value)
                                }} className={s.inputAccount}></input>
                            </div>
                            <div className={s.about_item}>
                                <div className={s.about_item_text_container}>
                                    <p>Дата рождения</p>
                                </div>
                                <input readOnly={flagToChangeProfileInfo} value={birthDate} onChange={(e) => {
                                    setBirthDate(e.target.value)
                                }} className={s.inputAccount}></input>
                            </div>
                            <div className={s.about_item}>
                                <div className={s.about_item_text_container}>
                                    <p>Доступно прокручиваний</p>
                                </div>
                                <input readOnly={flagToChangeProfileInfo} value={luckyKissCount} onChange={(e) => {
                                    setLuckyKissCount(e.target.value)
                                }} className={s.inputAccount}></input>
                            </div>
                    </div>
                    {flagToChangeProfileInfo ?
                                <button style={{fontWeight: '300', cursor: 'pointer', marginLeft: '10%', height: '60px'}}  onClick={() => {
                                setFlagToChangeProfileInfo(false)
                            }}>Изменить</button>
                        : 
                            <button style={{fontWeight: '300', cursor: 'pointer', marginLeft: '10%', height: '60px'}} onClick={() => {
                                patchProfile(item.id)
                                setFlagToChangeProfileInfo(true)

                            }}>Сохранить</button> }
                </div>


                <p onClick={() => {
                    if (isVisibleOrders === true) {
                        setIsVisibleOrders(false)
                    } else {
                        setIsVisibleOrders(true)

                    }
                }} style={{color: 'black', marginTop: '20px', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer'}}>ЗАКАЗЫ ПОЛЬЗОВАТЕЛЯ {isVisibleOrders ? '↑' : '↓'}</p>
                <div className={`${s.grid_container_about_orderList} ${isVisibleOrders ? s.visible : s.hidden}`}>
                                <div className={s.grid_item}>ID:</div>
                                <div className={s.grid_item}>Код:</div>
                                <div className={s.grid_item}>Дата:</div>
                                <div className={s.grid_item}>Статус:</div>
                                <div className={s.grid_item}>Выбранные товары:</div>
                </div>  
                { orderList.length !== 0 ? paginatedOrderList.map((item:any) => (
                    
                    <div  key={item.id} className={`${s.grid_container_orderList}  ${isVisibleOrders ? s.visible : s.hidden}`}> 
                        <div className={s.grid_item}>{item.id}</div>
                        <div className={s.grid_item}>{item.code}</div>
                        <div className={s.grid_item}>{item.date_created}</div>
                        <div className={s.grid_item}>{item.status}</div>
                        <div className={s.grid_item}>
                                {item.images.map((item: string, index: number) => (
                                    <LazyLoadImage src={item}
                                    width={50} height={50}
                                    key={index}
                                    alt="Image Alt"
                                    effect="blur"
                                />

                                ))}
                            </div>                    </div>
                )) : 
                    <div className={`${s.order} ${isVisibleOrders ? s.visible : s.hidden}`}>
                        <p>Нет информации</p>
                    </div> 
                }

            <div style={{display: 'flex', gap: '5px'}} className={`${s.pagination} ${isVisibleOrders ? s.visible : s.hidden}`}>
                {Array.from({ length: Math.ceil(orderList.length / ITEMS_PER_PAGE) }, (_, i) => (
                    <button key={i} onClick={() => handleOrdersPageChange(i + 1)}>{i + 1}</button>
                ))}
            </div>

                <p onClick={() => {
                    setIsVisibleOrders(false)      
                }} style={{color: 'black', marginTop: '5px', fontWeight: '600', marginBottom: '15px', backgroundColor: 'lightgrey', borderRadius: '15px', padding: '15px', textAlign: 'center', display: isVisibleOrders ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}> {isVisibleOrders ? '↑' : '↓'}</p>

                <p onClick={() => {
                                       if (isVisiblePromocodes === true) {
                                        setIsVisiblePromocodes(false)
                                    } else {
                                        setIsVisiblePromocodes(true)
                
                                    }
                }} style={{color: 'black', marginTop: '5px', fontWeight: '600', marginBottom: '15px', textDecoration: 'underline', cursor: 'pointer'}}>ПРОМОКОДЫ ПОЛЬЗОВАТЕЛЯ {isVisiblePromocodes ? '↑' : '↓'}</p>
                <div className={`${s.grid_container_about_promocodes} ${isVisiblePromocodes ? s.visible : s.hidden}`}>
                                <div className={s.grid_item}>ID:</div>
                                <div className={s.grid_item}>Дейстует до:</div>
                                <div className={s.grid_item}>Код:</div>
                                <div className={s.grid_item}>Использовано:</div>
                                <div className={s.grid_item}></div>
                </div>  
                

                {discountList.length !== 0 ? paginatedDiscountList.map((item: any) => (

                        <div key={item.id} className={`${s.grid_container_promocodes} ${isVisiblePromocodes ? s.visible : s.hidden}`}> 
                                                <div className={s.grid_item}>{item.id}</div>
                                                <div className={s.grid_item}>{item.expiration_date}</div>
                                                <div className={s.grid_item}>{item.code}</div>
                                                <div className={s.grid_item}>{item.used === true ? 'Да' : 'Нет' }</div>
                                                <div className={s.grid_item}></div>

                                            </div>
                ))

                
                
                :
                    <div className={`${s.promocodes} ${isVisiblePromocodes ? s.visible : s.hidden}`}>
                        <p>Нет информации</p>
                    </div>
                }


<div style={{display: 'flex', gap: '5px'}} className={`${s.pagination} ${isVisiblePromocodes ? s.visible : s.hidden}`}>
                {Array.from({ length: Math.ceil(discountList.length / ITEMS_PER_PAGE) }, (_, i) => (
                    <button key={i} onClick={() => handlePromocodesPageChange(i + 1)}>{i + 1}</button>
                ))}
            </div>
                <p onClick={() => {
                    setIsVisiblePromocodes(false)      
                }} style={{color: 'black', marginTop: '5px', fontWeight: '600', marginBottom: '15px', backgroundColor: 'lightgrey', borderRadius: '15px', padding: '15px', textAlign: 'center', display: isVisiblePromocodes ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}> {isVisiblePromocodes ? '↑' : '↓'}</p>

                </div>  
                </ div>

                )) : <p style={{marginLeft: '15px', color: 'black'}}>Аккаунтов нет</p>}

   
           </div>
        </div>
    </div>
)
}

export default Accounts
