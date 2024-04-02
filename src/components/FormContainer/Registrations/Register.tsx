import {useNavigate} from "react-router-dom";
import {supabase} from "../../../constans/dT";
import {FormEvent, useState} from "react";
import {useAuthContext} from "../../../constans/AuthContext";


const Register = () => {
    let navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {isAdmin,setIsAdmin, setIsUser, isUser} = useAuthContext();
    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Check if user with the same login already exists
            const { data: existingUsers, error: existingUsersError } = await supabase
                .from('registration')
                .select()
                .eq('login', login);

            if (existingUsersError) {
                throw existingUsersError;
            }

            if (existingUsers && existingUsers.length > 0) {
                setErrorMessage('Пользователь с таким именем уже существует');
                return;
            }
            const { data:user, error } = await supabase
                .from('registration')
                .insert([
                    { login: login, password: password },
                ])
                .select()

            if (error) {
                throw error;
            }

            localStorage.setItem('isAdmin', JSON.stringify(false));
            localStorage.setItem('isUser', JSON.stringify(true));
            setIsAdmin(false);
            setIsUser(true);

            navigate(`/record-auth/${user[0].id_registration}`); // Переходим на страницу входа после успешной регистрации
        } catch (error) {
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