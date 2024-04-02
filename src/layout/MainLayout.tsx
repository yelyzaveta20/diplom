import {Header} from "../components/Header/Header";
import {Outlet, useNavigate} from "react-router-dom";

import {FormEvent, useEffect, useState} from "react";
import {supabase} from "../constans/dT";

const MainLayout = () => {
//     const [isAdmin, setIsAdmin] = useState(true);
//     const [login, setLogin] = useState('');
//     const [password, setPassword] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
// let navigate = useNavigate();
//     const [headerLoaded, setHeaderLoaded] = useState(false);
//     useEffect(() => {
//         const handleLogin = async () => {
//
//             try {
//                 // Выполняем запрос к базе данных для проверки логина и пароля
//                 const { data: users, error } = await supabase
//                     .from('registration')
//                     .select('*')
//                     .eq('login', login)
//                     .eq('password', password);
//
//                 if (error) {
//                     throw error;
//                 }
//
//                 // Если найден пользователь с введенным логином и паролем
//                 if (users && users.length > 0) {
//                     // Если логин и пароль "admin", переходим на страницу администратора, иначе на страницу донора
//                     if (login === 'admin' && password === 'admin') {
//                         setIsAdmin(true);
//
//                     } else {
//                         setIsAdmin(false);
//
//                     }
//                 } else {
//                     setErrorMessage('Неправильный логин или пароль');
//                 }
//             } catch (error) {
//                 setErrorMessage('Ошибка при проверке логина и пароля');
//             }
//         };
//
//         setHeaderLoaded(true);
//
//     }, [headerLoaded]);


    // const handleLogout = () => {
    //     setIsAdmin(false);
    //     navigate('/login');
    // };
    return (
        <div>
           <Header/>


            <Outlet  />
        </div>
    );
};

export {MainLayout};