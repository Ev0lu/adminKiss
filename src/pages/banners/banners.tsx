import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import s from './banners.module.css'
import Navbar from '../../shared/navbar/navbar';
import { getToken, setToken } from '../../App';
import { useNavigate } from 'react-router-dom';
import { createBanner, deleteBanner, getBanners, getCategories, patchBanner, patchCategoryBanner } from '../../shared/api';

const Banners = () => {
  const [idDelete, setIdDelete] = useState<string>('');
  const [idCategoryBanner, setIdCategoryBanner] = useState<string>('');

  const [categories, setCategories] = useState<any>()
  const [categoriesWithFirstId, setCategoriesWithFirstId] = useState<any>()
  const [productBanners, setProductBanners] = useState<any>([]);
  const [id, setId] = useState<string>('');
  const [product, setProduct] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [bannerDeleteError, setBannerPatchDeleteError] = useState<string>('');

  const getCategoriesById = async () => {
      const token = getToken('access');
      if (!token) {
            navigate('/')
        }
        const response = await getCategories('2', token)
        const data = await response.json()
        setCategories(data)

        const responseCategoriesWithFirstId = await getCategories('1', token)
        const dataCategoriesWithFirstId = await responseCategoriesWithFirstId.json()
        setCategoriesWithFirstId(dataCategoriesWithFirstId)

        const responseBannersProducts = await getBanners(token)
        const dataBannersProducts = await responseBannersProducts.json()
        setProductBanners(dataBannersProducts)
  }

  useEffect(() => {
    getCategoriesById()
  }, [])

  const handleFormDelete = async () => {
      const token = getToken('access');
      if (!token) {
            navigate('/')
        };
      const response = await deleteBanner(idDelete, token)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setBannerPatchDeleteError('Успешно удалено')
      } else {
        setBannerPatchDeleteError('Произошла ошибка')

      }
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      };
    event.preventDefault();

    const formData = new FormData();
    if (product) {
      formData.append('product', product);
    } 

    if (image) {
      formData.append('image', image);  
    }

    if (id === '') {
      const response = await createBanner(formData, token)
      if (response.status === 200 || response.status === 201) {
        setError('Успешно создано/пропатчено')
      } else {
        setError('Возникла ошибка')
      }
    } else {
      const response = await patchBanner(formData, id, token)
      if (response.status === 200 || response.status === 201) {
        setError('Успешно создано/пропатчено')
      } else {
        setError('Возникла ошибка')
      }
    }
  };

  const handleFormCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      };
    event.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append('image', image);  
    }
      const response = await patchCategoryBanner(formData, idCategoryBanner, token)
      if (response.status === 200 || response.status === 201) {
        setCategoryBannerError('Успешно создано/пропатчено')
      } else {
        setCategoryBannerError('Возникла ошибка')
      }
      const data = await response.json()
      console.log(data)

    
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const [error, setError] = useState<string>('');
  const [categoryBannerError, setCategoryBannerError] = useState<string>('');
  const navigate = useNavigate()
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
    <div className={s.main_wrapper}>
      <div className={s.form_meditation}>
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ/ИЗМЕНИТЬ БАННЕР ДЛЯ ГЛАВНОЙ</h2>
        <form onSubmit={handleFormSubmit}>
        <div className={s.formItem}>
            <label>Айди баннера:</label>
            <input type="text" placeholder='Пустое поле если новый баннер' value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>ID продукта:</label>
            <textarea value={product} onChange={(e) => setProduct(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Изображение:</label>
            <input className={s.fileInput} required={false} name="file" type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <button className={s.btnUpload} type="submit">Сохранить</button>
          <p style={{color: 'red', marginTop: '5px'}}>{error}</p>
        </form>
      </div>
      <div className="wrapper">
          <div className={s.form_meditation_delete}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>УДАЛИТЬ БАННЕР</h2>
            <div className={s.formItem}>
                  <label>Айди:</label>
                  <input type="text" placeholder='Id для удаления' value={idDelete} onChange={(e) => setIdDelete(e.target.value)} />
                </div>
                <p style={{color: 'red', marginTop: '5px', fontSize: '12px'}}>{bannerDeleteError}</p>

                <button style={{marginTop: '50%'}} onClick={() => handleFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
            </div>
            <div className={s.form_meditation_list}>
              <div style={{fontSize: '14px', marginBottom: '10px', marginTop: '10px'}} className={s.formItemList}>
                        <label>Формат вывода: "ID: Название: Изображение"</label>
                  </div>
                <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>Баннеры продукта</h2>
  
                {productBanners && productBanners.map((item: any) => (
                    <div style={{display: 'flex', gap: '10px', width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: '10px'}} key={item.id}>
                      <p>ID Баннера: {item.id}:</p>
                      <p>ID Продукта: {item.product}:</p>
                      <img src={item.image} alt='img' style={{ width: '100px', height: '100px' }} />
                    </div>
                  ))}
            </div>
        </div>
        <div className={s.wrapper}>
            <div className={s.form_meditation_category}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ/ИЗМЕНИТЬ БАННЕР ДЛЯ КАТЕГОРИИ</h2>
            <form onSubmit={handleFormCategorySubmit}>
            <div className={s.formItem}>
                <label>Айди баннера:</label>
                <input type="text" placeholder='ID категории' value={idCategoryBanner} onChange={(e) => setIdCategoryBanner(e.target.value)} />
              </div>
              <div className={s.formItem}>
                <label>Изображение:</label>
                <input className={s.fileInput} name="file" type="file" accept="image/*" onChange={handleImageChange}  />
              </div>
              <button className={s.btnUpload} style={{marginTop: '70px'}} type="submit">Сохранить</button>
              <p style={{color: 'red', marginTop: '5px', fontSize: '12px'}}>{categoryBannerError}</p>
            </form>
          </div>
            <div className={s.form_meditation_list}>
              <div style={{fontSize: '14px', marginBottom: '10px', marginTop: '10px'}} className={s.formItemList}>
                        <label>Формат вывода: "ID: Название"</label>
                  </div>
                <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>Категории</h2>
                { categories && Object.entries(categories.contents).map(([key, value]: any[]) => (
                    <div className={s.formItemList} key={key}>
                      {key}: {value.category_name}
                    </div>
                  ))}
                {categoriesWithFirstId?.contents &&
                  Object.entries(categoriesWithFirstId.contents).map(([, subcategories]) => (
                    subcategories && Object.entries(subcategories).map(([subcategoryId, { category_name }]) => (
                      <div className={s.formItemList} key={subcategoryId}>
                        {subcategoryId}: {category_name}
                      </div>
                    ))
                  ))
                }
            </div>
        </div>
    </div>
   </div>
  </div>

  );
};

export default Banners;
