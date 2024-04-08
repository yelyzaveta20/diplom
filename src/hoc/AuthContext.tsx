import {supabase} from "../constans/dT";
import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface AuthContextType {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
    isUser: boolean;
    setIsUser: (value: boolean) => void;

}

const AuthContext = createContext<AuthContextType>({ isAdmin: false ,setIsAdmin: () => {} , isUser: false ,setIsUser: () => {}});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children?: ReactNode }>  = ({children}) => {
    const [isAdmin, setIsAdmin] = useState(true);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isUser, setIsUser] = useState(false);
    const [idRegistration, setIdRegistration] = useState('');

    useEffect(() => {
        const handleLogin = async () => {
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
                    const user = users[0]; // Assuming you're interested in the first user if multiple are found
                    // Set id_registration in state or variable
                    setIdRegistration(user.id_registration);
                    // Если логин и пароль "admin", переходим на страницу администратора, иначе на страницу донора
                    if (login === 'admin' && password === 'admin') {
                        setIsAdmin(true);
                        setIsUser(false);


                    } else {
                        setIsAdmin(false);
                        setIsUser(true);
                    }
                } else {
                    setErrorMessage('Неправильный логин или пароль');
                }
            } catch (error) {
                setErrorMessage('Ошибка при проверке логина и пароля');
            }
        };

        handleLogin(); // Вызываем функцию для автоматической проверки при загрузке контекста

    }, [setIsAdmin,setIsUser]); // Пустой массив зависимостей, чтобы эффект выполнился только один раз при монтировании

    return (
        <AuthContext.Provider value={{ isAdmin,setIsAdmin,setIsUser,isUser}}>
            {children}
        </AuthContext.Provider>
    );

};
export const useAuthContext = () => {
    return useContext(AuthContext);
};
export default AuthContext;