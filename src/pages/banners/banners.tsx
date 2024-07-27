import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import s from './banners.module.css'
import Navbar from '../../shared/navbar/navbar';
import { getToken, setToken } from '../../App';
import { useNavigate } from 'react-router-dom';
import { createBanner, deleteBanner, getBanners, getCategories, patchBanner } from '../../shared/api';

const Banners = () => {
  const [idDelete, setIdDelete] = useState<string>('');
  const [idSearch, setIdSearch] = useState<string>('');
  const [categories, setCategories] = useState<any>()
  const [categoriesWithFirstId, setCategoriesWithFirstId] = useState<any>()
  const [productBanners1, setProductBanners] = useState<any>();

  const productBanners = [
    {
      "id": 4,
      "image": "https://storage.yandexcloud.net/drf-kisy-bucket/%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80_%D0%BC%D0%B0%D0%BB_%D0%B3%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9..webp?AWSAccessKeyId=YCAJEnWxe9Y8kvu18D0wREU9w&Signature=pC20xzxAmmCVpH3LqewBZslg4hQ%3D&Expires=1721984523",
      "product": 33
    },
    {
      "id": 4,
      "image": "https://storage.yandexcloud.net/drf-kisy-bucket/%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80_%D0%BC%D0%B0%D0%BB_%D0%B3%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9..webp?AWSAccessKeyId=YCAJEnWxe9Y8kvu18D0wREU9w&Signature=pC20xzxAmmCVpH3LqewBZslg4hQ%3D&Expires=1721984523",
      "product": 33
    },
    {
      "id": 4,
      "image": "https://storage.yandexcloud.net/drf-kisy-bucket/%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80_%D0%BC%D0%B0%D0%BB_%D0%B3%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9..webp?AWSAccessKeyId=YCAJEnWxe9Y8kvu18D0wREU9w&Signature=pC20xzxAmmCVpH3LqewBZslg4hQ%3D&Expires=1721984523",
      "product": 33
    },
    {
      "id": 4,
      "image": "https://storage.yandexcloud.net/drf-kisy-bucket/%D0%B1%D0%B0%D0%BD%D0%BD%D0%B5%D1%80_%D0%BC%D0%B0%D0%BB_%D0%B3%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9..webp?AWSAccessKeyId=YCAJEnWxe9Y8kvu18D0wREU9w&Signature=pC20xzxAmmCVpH3LqewBZslg4hQ%3D&Expires=1721984523",
      "product": 33
    }
  ]

  const getCategoriesById = async () => {
      const token = getToken('access');
      if (!token) {
            navigate('/')
        };
        const response = await getCategories('2', token)
        const data = await response.json()
        console.log(data)
        setCategories(data)
        const responseCategoriesWithFirstId = await getCategories('1', token)
        const dataCategoriesWithFirstId = await responseCategoriesWithFirstId.json()
        console.log(data)
        setCategoriesWithFirstId(dataCategoriesWithFirstId)
        const responseBannersProducts = await getBanners(token)
        const dataBannersProducts = await responseBannersProducts.json()
        console.log(dataBannersProducts)
        setProductBanners(dataBannersProducts)
  }
  useEffect(() => {
    //getCategoriesById()
  }, [])

  const [id, setId] = useState<string>('');
  const [product, setProduct] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const handleFormDelete = async () => {
      const token = getToken('access');
      if (!token) {
            navigate('/')
        };
      const response = await deleteBanner(idDelete, token)
      if (response.status !== 200) {
        setIdDelete('Error')
      }
      const data = await response.json()
      console.log(data)
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

    console.log(formData, image)
    if (id === '') {
      console.log('crate successful');

      const response = await createBanner(formData, token)
      if (response.status !== 200) {
          setId('Error')
        }
    } else {
      console.log('Upload successful');

      const response = await patchBanner(formData, id, token)
      if (response.status !== 200) {
        setId('Error')
      }
      const data = await response.json()
      console.log(data)

    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
        setImage(file);
    }
  };

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
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ/ИЗМЕНИТЬ БАННЕР ДЛЯ ПРОДУКТА</h2>
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
            <label>Картинки:</label>
            <input className={s.fileInput} name="file" type="file" accept="image/*" multiple onChange={handleImageChange} />
          </div>
          <button className={s.btnUpload} type="submit">Отправить</button>
        </form>
      </div>
      <div className="wrapper">
          <div className={s.form_meditation_delete}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>УДАЛИТЬ БАННЕР ПРОДУКТА</h2>
            <div className={s.formItem}>
                  <label>Айди:</label>
                  <input type="text" placeholder='Id для удаления' value={idDelete} onChange={(e) => setIdDelete(e.target.value)} />
                </div>
                <button onClick={() => handleFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
            </div>
            <div className={s.form_meditation_list}>
              <div style={{fontSize: '14px', marginBottom: '10px', marginTop: '10px'}} className={s.formItemList}>
                        <label>Формат вывода: "ID: Название: Изображение"</label>
                  </div>
                <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>Баннеры продукта</h2>
  
                {productBanners.map((item: any) => (
                    <div style={{display: 'flex', gap: '10px', width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center'}} key={item.id}>
                      <h3>{item.id}:</h3>
                      <p>{item.product}</p>
                      <img src={item.image} alt='img' style={{ width: '50px', height: '50px' }} />
                    </div>
                  ))}




            </div>
        </div>
        <div className={s.wrapper}>
            <div className={s.form_meditation_category}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ/ИЗМЕНИТЬ БАННЕР ДЛЯ КАТЕГОРИИ</h2>
            <form onSubmit={handleFormSubmit}>
            <div className={s.formItem}>
                <label>Айди баннера:</label>
                <input type="text" placeholder='ID категории' value={id} onChange={(e) => setId(e.target.value)} />
              </div>
              <div className={s.formItem}>
                <label>Картинки:</label>
                <input className={s.fileInput} name="file" type="file" accept="image/*" multiple onChange={handleImageChange} />
              </div>
              <button className={s.btnUpload} type="submit">Отправить</button>
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
                  Object.entries(categoriesWithFirstId.contents).map(([parentCategoryName, subcategories]) => (
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
    <div className={s.main_wrapper}>
      <div className={s.form_meditation}>
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ/ИЗМЕНИТЬ БАННЕР ДЛЯ ПРОДУКТА</h2>
        <form onSubmit={handleFormSubmit}>
        <div className={s.formItem}>
            <label>Айди баннера:</label>
            <input type="text" placeholder='ID Категории' value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>ID продукта:</label>
            <textarea value={product} onChange={(e) => setProduct(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Картинки:</label>
            <input className={s.fileInput} name="file" type="file" accept="image/*" multiple onChange={handleImageChange} />
          </div>
          <button className={s.btnUpload} type="submit">Отправить</button>
        </form>
      </div>
      <div className="wrapper">
          <div className={s.form_meditation_delete}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>УДАЛИТЬ</h2>
            <div className={s.formItem}>
                  <label>Айди:</label>
                  <input type="text" placeholder='Id для удаления' value={idDelete} onChange={(e) => setIdDelete(e.target.value)} />
                </div>
                <button onClick={() => handleFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
            </div>
            <div className={s.form_meditation_list}>
              <div style={{fontSize: '14px', marginBottom: '10px', marginTop: '10px'}} className={s.formItemList}>
                        <label>Формат вывода: "ID: Название: Изображения"</label>
                  </div>
                <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>Категории</h2>
  
                { categories && Object.entries(categories.contents).map(([key, value]: any[]) => (
                    <div className={s.formItemList} key={key}>
                      {key}: {value.category_name}
                    </div>
                  ))}
                <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px', marginTop: '10px'}}>Подкатегории</h2>
                <input type="text" placeholder='Id категории' value={idSearch} onChange={(e) => setIdSearch(e.target.value)} />
                <button style={{marginLeft:'35%'}} onClick={() => {
                  getCategoriesById()
                }}>Найти</button>


            </div>
        </div>
    </div>
      
    </div>
    </div>

  );
};

export default Banners;
