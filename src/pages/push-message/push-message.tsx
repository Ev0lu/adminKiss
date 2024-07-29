import { useState } from 'react'
import s from'./push-message.module.css'
import Navbar from '../../shared/navbar/navbar'
import { notification } from '../../shared/api';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../../App';

function PushMessage() { 

  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [bodyMessage, setBodyMessage] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate()

  
    const sendNotification = async () => {
        const token = getToken('access');
        if (!token) {
            navigate('/')
        };

        const data = {
            "user_id": Number(userId),
            "title": title,
            "body": bodyMessage
        }

        const response = await notification(data, token)
        
        if (response.status === 200) {
            setUserId('')
            setError('Успешно отправлено')
            setTitle('')
            setBodyMessage('')
        } else if (response.status === 403) {
            setError('Пользователь выключил уведомления')
        } else {
            setError('Error')
        }
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

        <div className={s.main_specialOffer}>
                    <div className={s.registrationForm_button_wrapper_main}>
                        <button onClick={() => {     sendNotification()                   }} className={s.registrationForm_button_main}>Послать уведомление</button>
                    </div>

                    <div className={s.registrationForm_field}>
                            <input
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Айди пользователя'></input>
                        </div> 
                        <div className={s.registrationForm_field}>
                            <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Заголовок сообщения'></input>
                        </div> 
                        <div className={s.registrationForm_field}>
                            <input
                            value={bodyMessage}
                            onChange={(e) => setBodyMessage(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Тело сообщения'></input>
                        </div> 
                        <p style={{color: 'red', marginTop: '5px'}}>{error}</p>

                </div>                
        </div>
    </div>
)
}

export default PushMessage
