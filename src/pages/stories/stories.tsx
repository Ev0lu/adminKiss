import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import s from './stories.module.css'
import Navbar from '../../shared/navbar/navbar';
import { getToken, setToken } from '../../App';
import { useNavigate } from 'react-router-dom';
import { deleteStoriesVideo, getCategories, patchStories, postStoriesVideo } from '../../shared/api';
import { Story } from '../../shared/story/story';
import Select from 'react-select';

interface ProductSelectorProps {
    setStoriesProducts: React.Dispatch<React.SetStateAction<string>>;
  }
  
  const ProductSelector: React.FC<ProductSelectorProps> = ({ setStoriesProducts }) => {
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
      setStoriesProducts(selectedValues.join(', '));
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
        <label style={{marginBottom: '5px'}}>ID продуктов:</label>
        <Select
          isMulti
          options={productOptions}
          onChange={handleSelectChange}
          styles={customStyles}
          placeholder="Выбрать..."
        />
        {/*<textarea style={{marginTop: '5px'}}
          value={selectedProducts.join(', ')}
          readOnly
        />*/}
      </div>
    );
  };



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
          <button style={{marginTop: '25%'}}className={s.btnUpload} type="submit">Сохранить</button>
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

                <button style={{marginTop: '66%'}} onClick={() => handleStoriesFormDelete()} className={s.btnUpload} type="submit">Удалить</button>
            </div>

        </div>
        <div className={s.form_meditation}>
        <h2 style={{marginBottom:'15px', fontWeight: '500', fontSize: '14px'}}>ИЗМЕНИТЬ ПРЕВЬЮ/ID продуктов у СТОРИС</h2>
        <form onSubmit={handlePatchStories}>
        <div className={s.formItem}>
            <label>Айди сторис:</label>
            <input type="text" placeholder='ID Сторис' value={idChangeStory} onChange={(e) => setIdChangeStory(e.target.value)} />
          </div>
            <ProductSelector setStoriesProducts={setStoriesProducts} />
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
