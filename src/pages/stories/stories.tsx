import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import s from './stories.module.css'
import Navbar from '../../shared/navbar/navbar';
import { getToken, setToken } from '../../App';
import { useNavigate } from 'react-router-dom';
import { deleteStoriesVideo, getStories, getStoriesById, patchStories, postStoriesVideo } from '../../shared/api';

const Stories = () => {
  const [idStory, setIdStory] = useState<string>('');
  const [idChangeStory, setIdChangeStory] = useState<string>('');
  const [idStoriesDelete, setStoriesIdDelete] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleStoriesFormDelete = async () => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      };
    const response = await deleteStoriesVideo(idStoriesDelete, token)
    if (response.status !== 200) {
      setStoriesIdDelete('Error')
    }
}

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const [storyCreateError, setStoryCreateError] = useState<string>('');
  const [storyPatchError, setStoryPatchError] = useState<string>('');

  
  const navigate = useNavigate()

  const [video, setVideo] = useState<File | null>(null);

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
  const [stories, setStories] = useState<any>([]);
  const [storiesProducts, setStoriesProducts] = useState<string>('');

  useEffect(() => {
    getAdminStories()
  }, [])

  const getAdminStories = async () => {
    const token = getToken('access');
    if (!token) {
          navigate('/')
      }
      const storyList = await getStories(token);
      const dataStoryList = await storyList.json()
      const detailedStories = await Promise.all(
        dataStoryList.map(async (story: any) => {
          const details = await getStoriesById(story.id, token);
          const dataDetails = await details.json()
          return dataDetails;
        })
      );
      setStories(detailedStories);

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

    <div className={s.main_wrapper}>
      <div className={s.form_meditation}>
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ДОБАВИТЬ ВИДЕО В СТОРИС</h2>
        <form onSubmit={handleFormStoriesSubmit}>
        <div className={s.formItem}>
            <label>Айди сторис:</label>
            <input type="text" placeholder='ID сторис' value={idStory} onChange={(e) => setIdStory(e.target.value)} />
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
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>УДАЛИТЬ ВИДЕО У СТОРИСА</h2>
            <div className={s.formItem}>
                  <label>Айди:</label>
                  <input type="text" placeholder='Id для удаления (31, 32, 34, 35)' value={idStoriesDelete} onChange={(e) => setStoriesIdDelete(e.target.value)} />
                </div>
                <button style={{marginTop: '55%'}} onClick={() => handleStoriesFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
            </div>

        </div>
        <div className={s.form_meditation}>
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ИЗМЕНИТЬ СТОРИС</h2>
        <form onSubmit={handlePatchStories}>
        <div className={s.formItem}>
            <label>Айди сторис:</label>
            <input type="text" placeholder='ID Сторис' value={idChangeStory} onChange={(e) => setIdChangeStory(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>ID продуктов:</label>
            <textarea value={storiesProducts} onChange={(e) => setStoriesProducts(e.target.value)} />
          </div>
          <div className={s.formItem}>
            <label>Картинки:</label>
            <input className={s.fileInput} onChange={handleImageChange} name="file" type="file" accept="image/*" />
          </div>
          <button className={s.btnUpload} type="submit">Сохранить</button>
          <p style={{color: 'red', marginTop: '5px'}}>{storyPatchError}</p>
        </form>
      </div>
      
    </div>
    <div className={s.form_meditation_list}>
            <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '18px', marginTop: '10px'}}>Сторисы</h2>
              {stories && stories.map((story: any) => (
                <div  className={s.story}>
                <h2 style={{marginBottom: '10px', fontSize: '18px', marginTop: '10px'}}>Сторис №{story.id}</h2>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'start'}} className="preview">
                  <p>Превью сторис:</p>
                  <img style={{width: '50px', height: '50px'}} src={story.preview} alt="Preview" />
                </div>
                <ul style={{display: 'flex', gap:'5px', marginBottom: '10px', alignItems: 'center', justifyContent: 'start', marginTop: '10px'}} className="products">
                  ID товаров:
                  {story?.products && story.products.map((productId: any) => (
                    <li key={productId}>{productId}</li>
                  ))}
                </ul>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'start'}} className="videos">
                  <p>Видео:</p>
                  {story?.videos && story.videos.map((video:any) => (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start'}} key={video.id}>
                      <p>{video.id}</p>
                      <img style={{width: '50px', height: '50px'}} src={video.video} alt={`Video ${video.id}`} />
                    </div>
                  ))}
                </div>
              </div>
              ))}
            </div>
    </div>
    </div>

  );
};

export default Stories;
