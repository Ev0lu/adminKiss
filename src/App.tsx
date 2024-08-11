import './App.css'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import Statistic from './pages/statistic/statistic'
import LoginPage from './pages/login/login'
import Orders from './pages/orders/orders';
import Logs from './pages/admin-logs/admin-logs';
import SpecialOffers from './pages/special-offer/special-offer';
import Kisses from './pages/kisses/kisses';
import PushMessage from './pages/push-message/push-message';
import Accounts from './pages/accounts/accounts';
import Meditations from './pages/meditations/meditations';
import Banners from './pages/banners/banners';
import Stories from './pages/stories/stories';
import { Provider } from 'react-redux';
import {store} from './shared/store/store'

export const setToken = (tokenName: string, newToken: string | null) => {
  if (newToken) {
    // Декодирование JWT без сторонней библиотеки
    const base64Url = newToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(base64));

    // Установка cookie без сторонней библиотеки
    const expires = new Date(decoded.exp * 1000).toUTCString();
    document.cookie = `${tokenName}=${newToken}; expires=${expires}; path=/`;
    return;
  }
  // Удаление cookie
  document.cookie = `${tokenName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const getToken = (tokenName: string) => {
  // Получение cookie без сторонней библиотеки
  const name = `${tokenName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};


const isTokenExpired = () => {
  const token = getToken('access'); // Предполагается, что функция getToken() уже определена
  if (!token) return true;

  // Декодирование JWT токена без сторонних библиотек
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedPayload = JSON.parse(window.atob(base64));

  // Вычисление времени, оставшегося до истечения срока действия токена
  const timeLeft = (decodedPayload.exp ?? 0) - Date.now() / 1000;

  // Если время меньше 15 минут (900 секунд), считаем токен истекшим
  return timeLeft < 900;
};

const sessionLoader = async () => {
  if (isTokenExpired()) {
      return redirect('/')
  }
  return true
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: '/stats',
    loader: sessionLoader,
    element: (
        <Statistic />
    )
  },
  {
    path: '/orders',
    loader: sessionLoader,
    element: (
        <Orders />
    )
  },
  {
    path: '/admin_logs',
    loader: sessionLoader,
    element: (
        <Logs />
    )
  },
  {
    path: '/special_offers',
    loader: sessionLoader,
    element: (
        <SpecialOffers />
    )
  },
  {
    path: '/kisses',
    loader: sessionLoader,
    element: (
        <Kisses />
    )
  },
  {
    path: '/push_message',
    loader: sessionLoader,
    element: (
        <PushMessage />
    )
  },
  {
    path: '/accounts',
    loader: sessionLoader,
    element: (
        <Accounts />
    )
  },
  {
    path: '/meditations',
    loader: sessionLoader,
    element: (
        <Meditations />
    )
  },
  {
    path: '/banners',
    loader: sessionLoader,
    element: (
        <Banners />
    )
  },
  {
    path: '/stories',
    loader: sessionLoader,
    element: (
        <Stories />
    )
  },

], { basename: '/kissmy/admin' })

function App() { 
  
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  )
}

export default App
