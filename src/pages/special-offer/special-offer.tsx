import { useEffect, useState } from 'react'
import s from'./special-offer.module.css'
import Navbar from '../../shared/navbar/navbar'
import { createPromocode, createSpecialOffer, deleteOffer, deletePromocode, getCategories, getOffers, getPromocodes } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';
import Select from 'react-select';


interface ProductSelectorProps {
    setOfferProducts: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string;
  }
  
  const ProductSelector: React.FC<ProductSelectorProps> = ({ setOfferProducts, placeholder }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [, setSelectedProducts] = useState<any[]>([]);
    const [productOptions, setProductOptions] = useState<any[]>([]);
    const navigate = useNavigate();
  
    const getCategoriesById = async () => {
      const token = getToken('access');
      if (!token) {
        navigate('/');
        return;
      }
      const response = await getCategories('0', token);
      const data = await response.json();
      setProducts(data.contents);
    };
  
    useEffect(() => {
      getCategoriesById();
    }, []);
  
    useEffect(() => {
      if (products.length > 0) {
        const options = products.map(product => ({
          value: product.id,
          label: `${product.id}: ${product.name}`
        }));
        setProductOptions(options);
      }
    }, [products]);
  
    const handleSelectChange = (selectedOptions: any) => {
      const selectedValues = selectedOptions ? selectedOptions.map((option: { value: any }) => option.value) : [];
      setSelectedProducts(selectedValues);
      setOfferProducts(selectedValues.join(', '));
    };


    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            color: 'black'
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'black'
        }),
        menu: (provided: any) => ({
            ...provided,
            color: 'black'
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: state.isSelected ? 'black' : 'black'
        }),
        multiValue: (provided: any) => ({
            ...provided,
            color: 'black'
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: 'black'
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: 'black'
        }),
    };

  
    return (
      <div style={{width: '100%', marginBottom: '10px'}}>
        <Select
          isMulti
          options={productOptions}
          onChange={handleSelectChange}
          styles={customStyles}
          placeholder={placeholder}
        />

      </div>
    );
  };




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

  const [promocodeError, setPromocodeError] = useState('');

  const [offerError, setOfferError] = useState('');

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
        if (response.status === 200 || response.status === 201) {
            setPromocodeError('Успешно создано')
          } else {
            setPromocodeError('Возникла ошибка')
          } 
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
        if (response.status === 200 || response.status === 201) {
            setOfferError('Успешно создано')
          } else {
            setOfferError('Возникла ошибка')
          } 
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

    const [activeTab, setActiveTab] = useState('promocodes')

    const [categories, setCategories] = useState<any>()
  
    const getCategoriesById = async () => {
        const token = getToken('access');
        if (!token) {
              navigate('/')
          };
        const response = await getCategories('0', token)
        const data = await response.json()
        console.log(data)  
        setCategories(data)
        setFilteredCategories(data.contents);

    }
    const [filteredCategories, setFilteredCategories] = useState<any>()

    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchQuery(value);

        // Filter kisses based on search query
        const filtered = categories.contents.filter(
            (product:any) => {
                    return product.name.toLowerCase().includes(value.toLowerCase())

        }
        );
        setFilteredCategories(filtered);
    };

  return (
    <div className={s.statisticPage}>
        <Navbar />
        <div className={s.statistic_wrapper}>

            <div className={s.header}>
            {activeTab === 'allProducts' && (
                <input
                    type="text"
                    placeholder="Поиск по названию"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className={s.searchInput}
                />
            )}
                <button onClick={() => setActiveTab('offers')}>Акции</button>
                <button onClick={() => setActiveTab('promocodes')}>Купоны</button>
                <button style={{marginRight: '50px'}} onClick={() => {
                    setActiveTab('allProducts')
                    getCategoriesById()
                    }}>Все товары</button>
   
                <div className={s.registrationForm_button_wrapper}>
                    <button onClick={() => {
                        setToken('access', '')
                        navigate('/')
                    }} className={s.registrationForm_button}>Выйти</button>
                </div>

            </div>
            {activeTab === 'offers' && (

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

                    {/*<div className={s.registrationForm_field}>
                            <input
                            value={selectedGoodsInclude}
                            onChange={(e) => setSelectedGoodsInclude(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Включая id товаров(через запятую)'></input>



                        </div>*/}
                        <ProductSelector setOfferProducts={setSelectedGoodsInclude} placeholder='Включая id товаров' />
                        <ProductSelector setOfferProducts={setSelectedGoodsExclude} placeholder='Исключая id товаров' />
                        <p style={{color: 'red', marginTop: '5px'}}>{offerError}</p>


                        {/*<div className={s.registrationForm_field}>
                            <input
                            value={selectedGoodsExclude}
                            onChange={(e) => setSelectedGoodsExclude(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Исключая id товаров(через запятую)'></input>
                        </div>*/}
                </div>
                <div className={s.main_stats}>
                    <div className={s.offersList}>
                            <h2>Акции</h2>
                            <input placeholder='Поиск по id' value={searchDiscount} onChange={(e: any) => {
                                setSearchDiscount(e.target.value)

                                
                                
                            }}  className={s.search}></input>

                            <div className={s.offersList_items}>
                            <div className={s.grid_container_about}>
                                <div className={s.grid_item}>ID:</div>
                                <div className={s.grid_item}>Тип:</div>
                                <div className={s.grid_item}>Все товары:</div>
                                <div className={s.grid_item}>Включая id товаров:</div>
                                <div className={s.grid_item}>Исключая товары:</div>
                                <div className={s.grid_item}></div>
                            </div>  

                            {filteredDiscount ? filteredDiscount.map((item: offerData) => (



                                            <div  key={item.id} className={`${s.grid_container}`}> 
                                                <div className={s.grid_item}>{item.id}</div>
                                                <div className={s.grid_item}>{item.type ? item.type : '-'}</div>
                                                <div className={s.grid_item}>{item.all_products === true ? 'Да' : 'Нет'}</div>
                                                <div className={s.grid_item}>{item.include_products ? item.include_products.toString() : '-'}</div>
                                                <div className={s.grid_item}>{item.exclude_products ? item.exclude_products.toString() : '-'}</div>
                                                <div onClick={() => {
                                                }} style={{fontWeight: '300', cursor: 'pointer'}} className={s.grid_item}><p onClick={() => {
                                                    deleteOfferById(item)
                                                }} className={s.deleteInscription}>Удалить</p>
                                                </div>
                                            </div>
                                        )

                                        ) : '-'}
                            </div>
                    </div> 
                </div>  
            </div>  
            )}

        {activeTab === 'promocodes' && (
            <div className={s.main}>
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
                        <p style={{color: 'red', marginTop: '5px'}}>{promocodeError}</p>

                </div>        
                <div className={s.main_stats}>
                        <div className={s.promocodesList}>
                           <h2>Промо</h2>
                           <input placeholder='Поиск по id' value={searchPromocode} onChange={(e: any) => {
                            setSearchPromocode(e.target.value)
                           }} className={s.search}></input>
                           <div className={s.promocodesList_items}>
                           <div className={s.grid_container_about}>
                                <div className={s.grid_item}>ID:</div>
                                <div className={s.grid_item}>Дейстует до:</div>
                                <div className={s.grid_item}>Скидка:</div>
                                <div className={s.grid_item}>Кол-во использований:</div>
                                <div className={s.grid_item}>Код:</div>
                                <div className={s.grid_item}></div>
                            </div>  
                            {filteredPromocode ? filteredPromocode.map((item: promocodeData) => (
                                        <div  key={item.id} className={`${s.grid_container}`}> 
                                            <div className={s.grid_item}>{item.id}</div>
                                            <div className={s.grid_item}>{item.expiration_date ? item.expiration_date : '-'}</div>
                                            <div className={s.grid_item}>{item.discount_percentage}%</div>
                                            <div className={s.grid_item}>{item.one_use === true ? 'Одно' : 'Бесконечно'}</div>
                                            <div className={s.grid_item}>{item.code}</div>
                                            <div onClick={() => {
                                            }} style={{fontWeight: '300', cursor: 'pointer'}} className={s.grid_item}><p onClick={() => {
                                                deletePromocodeById(item)
                                            }} className={s.deleteInscription}>Удалить</p>
                                            </div>
                                        </div>
                                    )
                                    ) : '-'}
                           </div>
                    </div>
                </div>
            </div>
            )}
        {activeTab === 'allProducts' && (
            <>
                <div className={s.grid_container_about}>
                            <div className={s.grid_item}>ID продукта:</div>
                            <div className={s.grid_item}>Название:</div>
                            <div className={s.grid_item}>Изображение:</div>
                            <div className={s.grid_item}>Цена:</div>
                    </div>  
                {filteredCategories && filteredCategories.map((product: any) => (
                <>

                    <div className={`${s.grid_container}`}> 
                            <div className={s.grid_item}>{product.id}</div>
                            <div className={s.grid_item}>{product.name ? product.name : '-'}</div>
                            <div className={s.grid_item}>{product.image ? <img style={{width: '50px', height: '50px'}} src={product.image.image} alt='' /> : '-'}</div>
                            <div className={s.grid_item}>{product.price ? product.price : '-'}</div>
                    </div>
                </>
                ))}
            </>
        )}
        </div>
    </div>
)
}

export default SpecialOffers
