import { useEffect, useState } from 'react'
import s from'./special-offer.module.css'
import Navbar from '../../shared/navbar/navbar'
import { createPromocode, createSpecialOffer, deleteOffer, deletePromocode, getOffers, getPromocodes } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function SpecialOffers() { 

  interface promocodeData {
    id: number,
    user?: number,
    expiration_date: string,
    discount_percentage: number,
    code: string,
    one_use: boolean
  }
  interface offerData {
    id: number,
    type: string,
    exclude_products?: number[],
    include_products?: number[],
    all_products?: boolean
  }
  const [promocodes, setPromocodes] = useState<promocodeData[]>([{
    id: 0,
    user: 0,
    expiration_date: "none",
    discount_percentage: 0,
    code: 'string',
    one_use: true

}])
  const [offers, setOffers] = useState<offerData[]>([{
    id: 0,
    type: 'Nothing',
}])

    
  const [searchDiscount, setSearchDiscount] = useState('');
  const [searchPromocode, setSearchPromocode] = useState('');
  const [filteredPromocode, setFilteredPromocode] = useState<promocodeData[]>();
  const [filteredDiscount, setFilteredDiscount] = useState<offerData[]>();

  useEffect(() => {
        const filteredDiscounts = searchDiscount ? offers.filter((discount: offerData) =>
            discount.id.toString().startsWith(searchDiscount)
        ) : offers;
        setFilteredDiscount(filteredDiscounts)

  }, [searchDiscount])

  useEffect(() => {
    const filteredPromocode = searchPromocode ? promocodes.filter((promocode: promocodeData) =>
        promocode.id.toString().startsWith(searchPromocode)
    ) : promocodes;
    setFilteredPromocode(filteredPromocode)

}, [searchPromocode])


  const [selectedСondition, setSelectedCondition] = useState('');
  const [selectedGoodsInclude, setSelectedGoodsInclude] = useState('');
  const [selectedGoodsExclude, setSelectedGoodsExclude] = useState('');
  const [selectedCountUsability, setSelectedCountUsability] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate()

  const handleInputChange = (e: any) => {
      let value = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
      if (value.length > 2) value = value.slice(0, 2) + '.' + value.slice(2);
      if (value.length > 5) value = value.slice(0, 5) + '.' + value.slice(5);
      if (value.length > 10) value = value.slice(0, 10); // Обрезаем до 10 символов
      setDate(value);
  };

  const formatDate = () => {
      const [day, month, year] = date.split('.');
      if (day && month && year) {
          return `${year}-${month}-${day}`;
      }
      return '';
  };

  const createPromocodeByAdmin = async () => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };
        const dataPromo = {
            ...(userId && {"user": Number(userId)}),
            "expiration_date": formatDate(),
            "discount_percentage": Number(selectedDiscount),
            ...(code && {"code": code}),
            "one_use": selectedCountUsability === "true"
        }
        const response = await createPromocode(dataPromo, token)
        
        if (response.status === 401) {
        } else {
            const data = await response.json()
            console.log(data)
            await getAllPromocodes()  

        }
  }


    const createOfferByAdmin = async () => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };

        const include = selectedGoodsInclude.split(',').map((item) => {
            return Number(item)
        })

        const exclude = selectedGoodsExclude.split(',').map((item) => {
            return Number(item)
        })

        const dataPromo = {
            type: selectedСondition,
            all_products: selectedGoodsInclude ? false : true,
            ...(selectedGoodsInclude && {"include_products": include}),
            ...(selectedGoodsExclude && {"exclude_products": exclude}),
        }
        const response = await createSpecialOffer(dataPromo, token)
        
        if (response.status === 401) {
        } else {
            const data = await response.json()
            console.log(data)
            await getAllOffers()  

            
        }
    }


    const getAllPromocodes = async () => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };

        const response = await getPromocodes(token)
        
        if (response.status === 401) {
        } else {
            const data = await response.json()
            console.log(data)
            setPromocodes(data)
            setFilteredPromocode(data)
            
        }
    }

    const getAllOffers = async () => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };

        const response = await getOffers(token)
        
        if (response.status === 401) {
        } else {
            const data = await response.json()
            console.log(data)
            setOffers(data)
            setFilteredDiscount(data)
            
            
        }
    }

    useEffect(() => {
        getAllOffers()
        getAllPromocodes()
    }, [])

    const deleteOfferById = async (item: offerData) => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };
        await deleteOffer(item.id, token)
        await getAllOffers()  
    }

    const deletePromocodeById = async (item: promocodeData) => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };
        await deletePromocode(item.id, token)
        await getAllPromocodes()  
    }

  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>

            <div className={s.header}>
   
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
                            createOfferByAdmin()
                        }} className={s.registrationForm_button_main}>Создать акцию</button>
                    </div>
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedСondition} onChange={(e:any) => {
                            setSelectedCondition(e.target.value)
                        }}>
                        <option value="" disabled selected>Выберите условие</option>
                        <option value="one_free_when_buying_one">1 + 1 free</option>
                        <option value="one_free_when_buying_two">2 + 1 free</option>
                        <option value="cheapest_free_when_buying_three">3(cheapest - free)</option>
                        </select>
                    </form>

                    <div className={s.registrationForm_field}>
                            <input
                            value={selectedGoodsInclude}
                            onChange={(e) => setSelectedGoodsInclude(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Включая id товаров(через запятую)'></input>



                        </div> 
                        <div className={s.registrationForm_field}>
                            <input
                            value={selectedGoodsExclude}
                            onChange={(e) => setSelectedGoodsExclude(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Исключая id товаров(через запятую)'></input>
                        </div> 
                </div>
                <div className={s.main_promocode}>
                    <div className={s.registrationForm_button_wrapper_main}>
                        <button onClick={() => {
                            createPromocodeByAdmin()
                        }} className={s.registrationForm_button_main}>Создать купон</button>
                    </div>
                    <div className={s.registrationForm_field}>
                            <input
                            value={date}
                            onChange={(e) => handleInputChange(e)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Дата (Пр. 21.07.2024)'></input>

                        </div> 
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedCountUsability} onChange={(e:any) => {
                            setSelectedCountUsability(e.target.value)
                        }}>
                        <option value="" disabled selected>Кол-во использований</option>

                        <option value="true">Одно кол-во</option>
                        <option value="false">Бесконечное кол-во</option>
                        </select>
                    </form>
                    <form className={s.form_wrapper}>
                        <select className={s.formOption} value={selectedDiscount} onChange={(e:any) => {
                            setSelectedDiscount(e.target.value)
                        }}>
                        <option value="" disabled selected>Скидка %</option>

                        <option value="5">5%</option>
                        <option value="10">10%</option>
                        <option value="15">15%</option>
                        <option value="20">20%</option>
                        <option value="25">25%</option>
                        <option value="30">30%</option>
                        </select>
                    </form>
                    <div className={s.registrationForm_field}>
                            <input
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='ID Пользователя(Опционально)'></input>
                    </div> 
                    <div className={s.registrationForm_field}>
                            <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Код купона(опционально)'></input>
                    </div> 
                </div>
                <div className={s.main_stats}>
                        <div className={s.promocodesList}>
                           <h2>Промо</h2>
                           <input placeholder='Поиск по id' value={searchPromocode} onChange={(e: any) => {
                            setSearchPromocode(e.target.value)
                           }} className={s.search}></input>
                           <div className={s.promocodesList_items}>
                            {filteredPromocode ? filteredPromocode.map((item: promocodeData) => (
                                        <div key={item.id} className={s.promocodeList_item}>
                                            <div className={s.item_body}>
                                                <p>id: {item.id}</p>
                                                <p>Действует до: {item.expiration_date}</p>
                                                <p>Скидка: {item.discount_percentage}%</p>
                                                <p>Кол-во использований: {item.one_use === true ? 'Одно' : 'Бесконечно'}</p>
                                                <p>code: {item.code}</p>
                                            </div>
                                            <p onClick={() => {
                                                deletePromocodeById(item)

                                            }} className={s.deleteInscription}>Удалить</p>


                                        </div>
                                    )

                                    ) : '-'}
                           </div>
                        </div>
                        <div className={s.offersList}>
                           <h2>Акции</h2>
                           <input placeholder='Поиск по id' value={searchDiscount} onChange={(e: any) => {
                            setSearchDiscount(e.target.value)

                            
                            
                           }}  className={s.search}></input>

                           <div className={s.offersList_items}>
                           {filteredDiscount ? filteredDiscount.map((item: offerData) => (
                                        <div key={item.id} className={s.promocodeList_item}>
                                            <div className={s.item_body}>
                                                <p>id: {item.id}</p>
                                                <p>Тип: {item.type}</p>
                                                <p>Действует на все товары: {item.all_products === true ? 'Да' : 'Нет'}</p>
                                                <p>Какие товары включены: {item.include_products ? item.include_products.toString() : '-'}</p>
                                                <p>Какие товары исключены: {item.exclude_products ? item.exclude_products.toString() : '-'}</p>
                                            </div>
                                            <p onClick={() => {
                                                deleteOfferById(item)
                                            }} className={s.deleteInscription}>Удалить</p>


                                        </div>
                                    )

                                    ) : '-'}
                           </div>
                        </div>  
                </div>
                
            </div>   
        </div>
    </div>
)
}

export default SpecialOffers
