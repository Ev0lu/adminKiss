import { useEffect, useState } from 'react'
import s from'./accounts.module.css'
import Navbar from '../../shared/navbar/navbar'
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';
import { getAccountById, getAccountOrders, getAccountPromocodes, getAccounts, patchAccount } from '../../shared/api';


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
  const [account, setAccount] = useState<accountInfoData>()
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
             <div className={s.grid_wrapper}>
             <div className={s.grid_container_about}>
                        <div className={s.grid_item}>Айди пользователя</div>
                        <div className={s.grid_item}>ФИО</div>
                        <div className={s.grid_item}>Почта</div>
                        <div className={s.grid_item}></div>
                        <div className={s.grid_item}></div>
                    </div>     

                {accounts ? accounts.map((item: any) => (
                    <>
                    <div key={item.id} className={s.grid_container}>
                        <div className={s.grid_item}>{item.id}</div>
                        <div className={s.grid_item}>{item.full_name}</div>
                        <div className={s.grid_item}>{item.email}</div>
                        <div onClick={() => {
                            setEmail('')
                            setPhone('')
                            setName('')
                            setLastName('')
                            setBirthDate('')
                            setLuckyKissCount('')
                            getInfoAboutAccount(item.id)
                            setSelectedItemId(item.id)

                        }} style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}} className={s.grid_item}>Подробнее {item.id === selectedItemId ? '↓' : '↑'}</div>
                                
                        {flagToChangeProfileInfo ?
                                <div style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}} className={s.grid_item} onClick={() => {
                                setFlagToChangeProfileInfo(false)
                            }}>Изменить</div>
                        : 
                            <div style={{color: 'blue', fontWeight: '300', cursor: 'pointer'}}  className={s.grid_item} onClick={() => {
                                patchProfile(item.id)
                                setFlagToChangeProfileInfo(true)

                            }}>Сохранить</div> }

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
                </div>


                <p style={{color: 'black', marginTop: '20px', fontWeight: '600'}}>ЗАКАЗЫ ПОЛЬЗОВАТЕЛЯ</p>
                { orderList.length !== 0 ? orderList.map((item:any) => (
                        <div className={s.order}>
                        <p>id: {item.id}</p>
                        <p>Код: {item.code}</p>
                        <p>Дата: {item.date_created}</p>
                        <p>status: {item.status}</p>
                        <p>Выбранные товары:</p>
                        <div className="img_wrapper">
                            {item.images.map((item: string, index: number) => (
                                <img key={index} src={item} />

                            ))}
                        </div>
                    </div> 
                )) : 
                    <div className={s.order}>
                        <p>Нет информации</p>
                    </div> 
                }
                <p style={{color: 'black', marginTop: '5px', fontWeight: '600', marginBottom: '15px'}}>ПРОМОКОДЫ ПОЛЬЗОВАТЕЛЯ</p>
                {discountList.length !== 0 ? discountList.map((item: any) => (
                        <div className={s.promocodes}>
                            <p>id: {item.id}</p>
                            <p>Действует до: {item.expiration_date}</p>
                            <p>Код: {item.code}</p>
                            <p>Использовано: {item.used}</p>
                        </div>
                ))
                :
                    <div className={s.promocodes}>
                        <p>Нет информации</p>
                    </div>
                }


                </div>  
                </>

                )) : 'Аккаунтов нет'}

   
           </div>
        </div>
    </div>
)
}

export default Accounts
