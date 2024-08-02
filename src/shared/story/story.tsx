import { useEffect } from 'react';
import s from './story.module.css'
import { useNavigate } from 'react-router-dom';
import poster from '../../assets/vite.svg'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoryById, selectLoading, selectStoryById } from '../store/storiesSlice';
import { AppDispatch } from '../store/store';

export const Story = ({id}: {id: string}) => {
      
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const story = useSelector(selectStoryById(id));  // Используем новый селектор
    const loading = useSelector(selectLoading);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          await dispatch(fetchStoryById(id)).unwrap();
        } catch (error) {
          navigate('/');
        }
      };
      fetchData();
    }, [dispatch, id, navigate]);

   return ( 
   <div  className={s.story}> 
    <h2 style={{marginBottom: '10px', fontSize: '18px', marginTop: '10px'}}>Сторис ID:{story && story.id}</h2>
    <div style={{display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'start'}} className="preview">
      <p>Превью сторис:</p>
      <img style={{width: '50px', height: '50px'}} src={story ? story.preview : ""} alt="Preview" />
    </div>
    <ul style={{display: 'flex', gap:'5px', marginBottom: '10px', alignItems: 'center', justifyContent: 'start', marginTop: '10px'}} className="products">
      ID товаров:
      {story?.products && story.products.map((productId: any) => (
        <li key={productId}>{productId}</li>
      ))}
    </ul>
    <div style={{display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'start'}} className="videos">
      <p>Видео:</p>
      {loading ? <div>Загрузка...</div> : story?.videos && story.videos.map((video:any) =>  {
          return (
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start' }}
              key={video.id}
            >
              <p>{video.id}</p>
              <LazyLoadImage src={video.video}
                width={50} height={50}
                alt="Image Alt"
                effect="blur"
                placeholderSrc={poster}
            />
      
            </div>
          );
      })}
    </div>
  </div>
    
  )
}