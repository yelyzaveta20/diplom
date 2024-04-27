import {useNavigate} from "react-router-dom";
import {supabase} from "../../../constans/dT";
import {FormEvent, useState} from "react";
import {useAuthContext} from "../../../hoc/AuthContext";
import css from './Register.module.css'

const Register = () => {
    let navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { setIsAdmin, setIsUser } = useAuthContext();

    const isValidEmail = (email:any) => {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    };

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!login.trim() || !password.trim()) {
            setErrorMessage('Будь-ласка, заповніть усі поля');
            return;
        }

        if (!isValidEmail(login)) {
            setErrorMessage('Будь-ласка, введіть коректну електронну пошту');
            return;
        }

        try {
            const { data: existingUsers, error: existingUsersError } = await supabase
                .from('registration')
                .select()
                .eq('login', login);

            if (existingUsersError) {
                throw existingUsersError;
            }

            if (existingUsers && existingUsers.length > 0) {
                setErrorMessage('Користувач іменем вже існує');
                return;
            }

            const { data: user, error } = await supabase
                .from('registration')
                .insert([{ login, password }])
                .select('id_registration')
                .single();

            if (error) {
                throw error;
            }

            localStorage.setItem('isAdmin', JSON.stringify(false));
            localStorage.setItem('isUser', JSON.stringify(true));
            setIsAdmin(false);
            setIsUser(true);

            navigate(`/record-auth/${user.id_registration}`); // Переходим на страницу входа после успешной регистрации
        } catch (error) {
            setErrorMessage('Виникла помилка при реєстрації');
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className={css.Register}>
            <div className={css.forming}>
                <div className={css.div}>
                    <p className={css.invite}>Реєстрація</p>
                    {errorMessage && <p>{errorMessage}</p>}
                    <form onSubmit={handleRegister}>
                        <input
                            className={css.forminput}
                            type="text"
                            placeholder="Введіть вашу електронну пошту"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <input
                            className={css.forminput}
                            type="password"
                            placeholder="Введіть ваш пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className={css.formbutton}>
                            <button type="submit">Зареєструватися</button>
                            <button type="button" onClick={handleLogin}>Вже є аккаунт? Увійти</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export {Register};