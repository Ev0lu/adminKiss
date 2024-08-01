import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import s from './meditations.module.css'
import Navbar from '../../shared/navbar/navbar';
import { getToken, setToken } from '../../App';
import { useNavigate } from 'react-router-dom';
import { createMeditation, deleteMeditation, getCategories, patchMeditation } from '../../shared/api';

const Meditations = () => {
  const [idDelete, setIdDelete] = useState<string>('');
  const [idSearch, setIdSearch] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deleteError, setDeleteError] = useState<string>('');

  const [categories, setCategories] = useState<any>()
  const [subcategories, setSubcategories] = useState<any>()

  const getCategoriesById = async () => {
      const token = getToken('access');
      if (!token) {
            navigate('/')
        };
      if (idSearch === '') {
        const response = await getCategories('2', token)
        const data = await response.json()
        console.log(data)
        setCategories(data)
        
      } else {
        const responseSub = await getCategories(idSearch, token)
        const dataSub = await responseSub.json()
        setSubcategories(dataSub)
        console.log(dataSub)
        const response = await getCategories('2', token)
        const data = await response.json()
        setCategories(data)
      }

  }
  useEffect(() => {
    getCategoriesById()
  }, [])

  const [id, setId] = useState<string>('');
  const [idCategory, setIdCategory] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const handleFormDelete = async () => {
      const token = getToken('access');
      if (!token) {
            navigate('/')
        };
      const response = await deleteMeditation(idDelete, token)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setDeleteError('Успешно удалено')
      } else {
        setDeleteError('Произошла ошибка')

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
    if (idCategory) {
      formData.append('category', idCategory);
    } 
    if (name) {
      formData.append('name', name);
    } 
    if (description){
      formData.append('description', description);
    }
    if (images.length !== 0) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }


    if (audio) {
      formData.append('audio', audio);
    }

    if (video) {
      formData.append('video', video);
    }
    console.log(formData, images)
    if (id === '') {
      console.log('crate successful');

      const response = await createMeditation(formData, token)
      if (response.status === 200 || response.status === 201) {
        setError('Успешно создано/пропатчено')
      } else {
        setError('Возникла ошибка')
      }
    } else {
      console.log('Upload successful');

      const response = await patchMeditation(formData, id, token)
      if (response.status === 200 || response.status === 201) {
        setError('Успешно создано/пропатчено')
      } else {
        setError('Возникла ошибка')
      }
      const data = await response.json()
      console.log(data)

    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(files as File[]);
  };

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setAudio(file);
    }
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setVideo(file);
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
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ/ИЗМЕНИТЬ</h2>
        <form onSubmit={handleFormSubmit}>
        <div className={s.formItem}>
            <label>Айди:</label>
            <input type="text" placeholder='Пустое поле если новая медитация' value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Категория:</label>
            <input type="text" placeholder='Id категории' value={idCategory} onChange={(e) => setIdCategory(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Имя:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Описание:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Картинки:</label>
            <input className={s.fileInput} name="file" type="file" accept="image/*" multiple onChange={handleImageChange} />
          </div>
          <div className={s.formItem}>
            <label>Аудио:</label>
            <input className={s.fileInput} type="file" name="file" accept="audio/*" onChange={handleAudioChange} />
          </div>
          <div className={s.formItem}>
            <label>Видео:</label>
            <input className={s.fileInput} type="file" name="file" accept="video/*" onChange={handleVideoChange} />
          </div>
          <button className={s.btnUpload} type="submit">Отправить</button>
          <p style={{color: 'red', marginTop: '5px'}}>{error}</p>
        </form>
      </div>
      <div className="wrapper">
          <div className={s.form_meditation_delete}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>УДАЛИТЬ</h2>
            <div className={s.formItem}>
                  <label>Айди:</label>
                  <input type="text" placeholder='Id для удаления' value={idDelete} onChange={(e) => setIdDelete(e.target.value)} />
                </div>
                <p style={{color: 'red', marginTop: '5px'}}>{deleteError}</p>

                <button onClick={() => handleFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
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
                <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px', marginTop: '10px'}}>Подкатегории</h2>
                <input type="text" placeholder='Id категории' value={idSearch} onChange={(e) => setIdSearch(e.target.value)} />
                <button style={{marginLeft:'35%'}} onClick={() => {
                  getCategoriesById()
                }}>Найти</button>

                { subcategories?.contents && Object.entries(subcategories.contents).map(([key, value]: any[]) => (
                    <div className={s.formItemList} key={key}>
                      {value.id}: {value.name}
                    </div>
                  ))}



            </div>
        </div>
    </div>

      
    </div>
    </div>

  );
};

export default Meditations;
