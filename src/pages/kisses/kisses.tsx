import { useEffect, useState } from 'react'
import s from'./kisses.module.css'
import Navbar from '../../shared/navbar/navbar'
import { getKisses } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function Kisses() { 
  interface kissData {
    type: string,
    discount_percentage?: number,
    product?: string,
    last_order: any,
    user_name: string,
    user_phone: string

}
  const [kisses, setKisses] = useState<kissData[]>([])
  const [filteredKisses, setFilteredKisses] = useState<kissData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');


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
        setFilteredKisses(data);

    }

    useEffect(() => {
        getKissesList()
    }, [])

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchQuery(value);
        const filtered = kisses.filter(
            (kiss) => {
                if (kiss.product){
                    return kiss.product.toLowerCase().includes(value.toLowerCase()) || kiss.user_name.toLowerCase().includes(value.toLowerCase())
                } else {
                    return kiss.user_name.toLowerCase().includes(value.toLowerCase())
            }
        }
        );
        setFilteredKisses(filtered);
    };


    //pagination

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 20;
    const paginatedKisses = filteredKisses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > Math.ceil(filteredKisses.length / itemsPerPage)) return;
        setCurrentPage(newPage);
      };
      
    const totalPages = Math.ceil(filteredKisses.length / itemsPerPage);
    
    return (
        <div className={s.statisticPage}>
          <Navbar />
          <div className={s.statistic_wrapper}>
            <div className={s.header}>
              <input
                type="text"
                placeholder="Поиск по выигрышу или имени пользователя"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className={s.searchInput}
              />
              <div className={s.registrationForm_button_wrapper}>
                <button onClick={() => {
                  setToken('access', '')
                  navigate('/')
                }} className={s.registrationForm_button}>Выйти</button>
              </div>
            </div>
            <div className={s.grid_container_about}>
              <div className={s.grid_item}>Тип</div>
              <div className={s.grid_item}>Выигрыш</div>
              <div className={s.grid_item}>Последний заказ</div>
              <div className={s.grid_item}>Имя пользователя</div>
              <div className={s.grid_item}>Телефон пользователя</div>
            </div>  
            {paginatedKisses.map((kiss: kissData) => (
              <div className={s.grid_container} key={kiss.user_phone}> {/* Added key prop */}
                <div className={s.grid_item}>{kiss.type === 'prize' ? 'Приз' : 'Скидка'}</div>
                <div className={s.grid_item}>{kiss.discount_percentage ? kiss.discount_percentage + '%' : kiss.product ? kiss.product : '-'}</div>
                <div className={s.grid_item}>{kiss.last_order ? kiss.last_order : '-'}</div>
                <div className={s.grid_item}>{kiss.user_name ? kiss.user_name : '-'}</div>
                <div className={s.grid_item}>{kiss.user_phone ? kiss.user_phone : '-'}</div>
              </div>
            ))}
            <div style={{margin:'15px'}} className={s.pagination}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>« Предыдущий</button>
              <span style={{color: 'black', paddingLeft: '10px', paddingRight: '10px'}}>Страница {currentPage} из {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Следующий »</button>
            </div>
          </div>
        </div>
      )
}

export default Kisses
