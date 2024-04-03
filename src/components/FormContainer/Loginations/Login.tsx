import {useNavigate} from "react-router-dom";
import {supabase} from "../../../constans/dT";
import {FormEvent, useState} from "react";
import css from './Login.module.css'
import {Header} from "../../Header/Header";
import {MainLayout} from "../../../layout";
import {useAuthContext} from "../../../constans/AuthContext";

const Login = () => {
    let navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {isAdmin,setIsAdmin, setIsUser, isUser} = useAuthContext();


    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Выполняем запрос к базе данных для проверки логина и пароля
            const { data: loginations, error } = await supabase
                .from('registration')
                .select('*')

                .eq('login', login)
                .eq('password', password);

            if (error) {
                throw error;
            }

            // Если найден пользователь с введенным логином и паролем
            if (loginations && loginations.length > 0) {
                const user = loginations[0]; // Assuming you're interested in the first user if multiple are found
                localStorage.setItem('id_registration', user.id_registration);
                // Set id_registration in state or variable


                // Если логин и пароль "admin", переходим на страницу администратора, иначе на страницу донора
                if (login === 'admin' && password === 'admin') {
                    localStorage.setItem('isAdmin', JSON.stringify(true));
                    localStorage.setItem('isUser', JSON.stringify(false));
                    setIsAdmin(true);
                    setIsUser(false);
                    navigate('/admin');


                } else {
                    localStorage.setItem('isAdmin', JSON.stringify(false));
                    localStorage.setItem('isUser', JSON.stringify(true));
                    setIsAdmin(false);
                    setIsUser(true);
                    navigate(`/donor/${user.id_registration}`);

                }
            } else {
                setErrorMessage('Неправильный логин или пароль');
            }
        } catch (error) {
            setErrorMessage('Ошибка при проверке логина и пароля');
        }
    };
    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div>

            <div className={css.Login}>
                <div className={css.forming}>
                    <div className={css.div}>
                        <p>Вход</p>
                        <form onSubmit={handleLogin}>
                            <input type="text" placeholder="Введите ваш логин" value={login}
                                   onChange={(e) => setLogin(e.target.value)} />
                            <input type="password" placeholder="Введите ваш пароль" value={password}
                                   onChange={(e) => setPassword(e.target.value)} />
                            <div>
                                <button type="submit">Войти</button>
                                <button type="button" onClick={handleRegister}>Зарегистрироваться</button>
                            </div>
                        </form>
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


export {Login};