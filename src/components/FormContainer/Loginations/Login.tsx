import {useNavigate} from "react-router-dom";
import {supabase} from "../../../constans/dT";
import {FormEvent, useState} from "react";

const Login = () => {

    let navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Выполняем запрос к базе данных для проверки логина и пароля
            const { data: users, error } = await supabase
                .from('registration')
                .select('*')
                .eq('login', login)
                .eq('password', password);

            if (error) {
                throw error;
            }

            // Если найден пользователь с введенным логином и паролем
            if (users && users.length > 0) {
                // Если логин и пароль "admin", переходим на страницу администратора, иначе на страницу донора
                if (login === 'admin' && password === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/record');
                }
            } else {
                setErrorMessage('Неправильний логин або пароль');

            }
        } catch (error) {
            setErrorMessage('Помилка при перевірці логіна та пароля:');
        }
    };

    const handleRegister = () => {
        navigate('/register');

    };

    return (
        <div>
            <p>Вход</p>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Введите ваш логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                <input type="password" placeholder="Введите ваш пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Войти</button>
                <button type="button" onClick={handleRegister}>Зарегистрироваться</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};


export {Login};