import { useState, ChangeEvent, FormEvent } from 'react';
import s from './stories.module.css'
import Navbar from '../../shared/navbar/navbar';
import { getToken, setToken } from '../../App';
import { useNavigate } from 'react-router-dom';
import { deleteStoriesVideo, patchStories, postStoriesVideo } from '../../shared/api';
import { Story } from '../../shared/story/story';


const Stories = () => {
  const [idStory, setIdStory] = useState<string>('');
  const [idChangeStory, setIdChangeStory] = useState<string>('');
  const [idStoriesDelete, setStoriesIdDelete] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [storiesProducts, setStoriesProducts] = useState<string>('');

  const [storyCount, ] = useState<number[]>([1, 2, 3])
  const [video, setVideo] = useState<File | null>(null);

  const [storyCreateError, setStoryCreateError] = useState<string>('');
  const [storyPatchError, setStoryPatchError] = useState<string>('');
  const [storyDeleteError, setStoryPatchDeleteError] = useState<string>('');


  const handleStoriesFormDelete = async () => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      };
    const response = await deleteStoriesVideo(idStoriesDelete, token)
    if (response.status === 200 || response.status === 201 || response.status === 204) {
        setStoryPatchDeleteError('Успешно удалено')
    } else {
        setStoryPatchDeleteError('Произошла ошибка')

    }
}

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  
  const navigate = useNavigate()


  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleFormStoriesSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      };
    event.preventDefault();

    const formData = new FormData();
     if (idStory){
        formData.append('story', idStory);  
     }

    if (video) {
      formData.append('video', video);  
    }
      const response = await postStoriesVideo(formData, token)
      if (response.status === 200 || response.status === 201) {
        setStoryCreateError('Успешно создано/пропатчено')
      } else {
        setStoryCreateError('Возникла ошибка')
      }
  };

  const handlePatchStories = async (event: FormEvent<HTMLFormElement>) => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      };
    event.preventDefault();
    const formData = new FormData();
    if (image) {
      formData.append('preview', image);  
    }
    if (storiesProducts) {
      formData.append('products', storiesProducts);
    }

      const response = await patchStories(formData, idChangeStory, token)
      if (response.status === 200 || response.status === 201) {
        setStoryPatchError('Успешно создано/пропатчено')
      } else {
        setStoryPatchError('Возникла ошибка')
      } 
  };

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
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ СТОРИС</h2>
        <form onSubmit={handleFormStoriesSubmit}>
        <div className={s.formItem}>
            <label>Айди сторис:</label>
            <input type="text" placeholder='ID сторис. Расположены ниже.' value={idStory} onChange={(e) => setIdStory(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Видео:</label>
            <input className={s.fileInput} type="file" name="file" accept="video/*" onChange={handleVideoChange} />
          </div>
          <button style={{marginTop: '18%'}}className={s.btnUpload} type="submit">Сохранить</button>
          <p style={{color: 'red', marginTop: '5px'}}>{storyCreateError}</p>

        </form>
      </div>
      <div className="wrapper">
          <div className={s.form_meditation_delete}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>УДАЛИТЬ СТОРИС</h2>
            <div className={s.formItem}>
                  <label>Айди:</label>
                  <input type="text" placeholder='Id для удаления. Пр. 37' value={idStoriesDelete} onChange={(e) => setStoriesIdDelete(e.target.value)} />
                </div>
                <p style={{color: 'red', marginTop: '5px'}}>{storyDeleteError}</p>

                <button style={{marginTop: '55%'}} onClick={() => handleStoriesFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
            </div>

        </div>
        <div className={s.form_meditation}>
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ИЗМЕНИТЬ ПРЕВЬЮ/ID продуктов у СТОРИС</h2>
        <form onSubmit={handlePatchStories}>
        <div className={s.formItem}>
            <label>Айди сторис:</label>
            <input type="text" placeholder='ID Сторис' value={idChangeStory} onChange={(e) => setIdChangeStory(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>ID продуктов:</label>
            <textarea value={storiesProducts} placeholder='Пример: 38, 31, 28. Все товары можно найти в разделе акции' onChange={(e) => setStoriesProducts(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Превью:</label>
            <input className={s.fileInput} onChange={handleImageChange} name="file" type="file" accept="image/*" />
          </div>
          <button className={s.btnUpload} type="submit">Сохранить</button>
          <p style={{color: 'red', marginTop: '5px'}}>{storyPatchError}</p>
        </form>
      </div>
      
    </div>
    <div className={s.form_meditation_list}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '18px', marginTop: '10px'}}>Сторисы</h2>
              {storyCount.map((storyNumber: number) => (
                <Story id={`${storyNumber}`}/>
              ))}
            </div>
    </div>
    </div>

  );
};

export default Stories;
