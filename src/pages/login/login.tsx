import s from './login.module.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { sendLoginSms, verifyLoginSms } from '../../shared/api';
import { setToken } from '../../App';

const LoginPage = () => {

    const navigate = useNavigate()
    const [temporaryToken, setTemporaryToken] = useState('')
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [code, setCode] = useState('')

    useEffect(() => {
        if (password == '') {
            setShowPassword(true)
        } else {
            setTimeout(() => setShowPassword(false), 200)
        }        
    }, [password])

    const [flagIsCodeVisible, setFlagIsCodeVisible] = useState(false)
  
    const sendLoginForm = async () => {
        const data = {
            email: login,
            password: password
        }
        const response = await sendLoginSms(data)
        if (response.status !== 200) {
            setPassword('')
            setLogin('')
        } else {
            setFlagIsCodeVisible(true)
            const data = await response.json()
            setTemporaryToken(data.temporary_token)
        }
    }

    const validateCodeForm = async () => {
        const data = {
            "temporary_token": temporaryToken,
            "sms_code": code 
        }
        const response = await verifyLoginSms(data)
        if (response.status !== 200) {
            setFlagIsCodeVisible(false)
        } else {
            const data = await response.json()
            setToken('access', data.access)
            setToken('refresh', data.refresh)

            navigate('/stats')
        }
    }

    return (
        <div className={s.loginPage}>
            <div className={s.loginPage_content}>
              <div className={s.loginPage_content__wrapper}>
                    <div className={s.registrationForm_header}>
                        <h1>ЛОГИН</h1>
                    </div>

                    <div className={s.registrationForm_field}>
                        <input value={login}
                        onChange={(e) => setLogin(e.target.value)} className={`${s.registrationForm_field__input}`} placeholder='Почта'></input>
                    </div>

                    <div className={s.registrationForm_field__password}>
                        <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        className={`${s.registrationForm_field__input__password}`} placeholder='Пароль'></input>

                    </div>    
                    <div className={s.registrationForm_button_wrapper}>
                            <button onClick={() => {
                                sendLoginForm()
                                setFlagIsCodeVisible(true)

                    }} className={s.registrationForm_button}>Отправить код</button>
                    </div>

                    <div  className={`${s.codeForm} ${flagIsCodeVisible === false ? s.codeFormHidden : s.codeFormVisible}`}>
                        <div className={s.registrationForm_field}>
                            <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={`${s.registrationForm_field__input__password}`} placeholder='Вам был выслан код'></input>
                        </div>    
                        <div className={s.registrationForm_button_wrapper}>
                                <button onClick={() => {
                                    validateCodeForm()
                        }} className={s.registrationForm_button}>Войти</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LoginPage