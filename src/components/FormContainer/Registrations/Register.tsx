import {useNavigate} from "react-router-dom";
import {supabase} from "../../../constans/dT";
import {FormEvent, useState} from "react";


const Register = () => {
    let navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const { data:user, error } = await supabase
                .from('registration')
                .insert([
                    { login: login, password: password },
                ])
                .select()

            if (error) {
                throw error;
            }

            console.log('Registration successful:', user);
            navigate('/recordAuth'); // Переходим на страницу входа после успешной регистрации
        } catch (error) {
            console.error('Registration error:', error);
            if (error === '23505') {
                setErrorMessage('Пользователь с таким логином уже существует');
            } else {
                setErrorMessage('Произошла ошибка при регистрации');
            }
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            <div>
                <p>Регистрация</p>
                {errorMessage && <p>{errorMessage}</p>}
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Введите ваш логин" value={login}
                           onChange={(e) => setLogin(e.target.value)}/>
                    <input type="password" placeholder="Введите ваш пароль" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <button type="submit">Зарегистрироваться</button>
                    <button type="button" onClick={handleLogin}>Уже есть аккаунт? Войти</button>
                </form>
            </div>

        </div>
    );
};

export {Register};