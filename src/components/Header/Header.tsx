import {NavLink, useLocation, useNavigate} from "react-router-dom";
import css from './Header.module.css'
import {FormEvent, useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {useAuthContext} from "../../constans/AuthContext";
const Header = () => {
    const navigate = useNavigate();
    const {isAdmin,setIsAdmin, setIsUser, isUser} = useAuthContext();

    useEffect(() => {
        // Retrieve values from local storage
        const isAdmin = localStorage.getItem('isAdmin');
        const isUser = localStorage.getItem('isUser');

        // Update context based on retrieved values
        setIsAdmin(isAdmin === 'true');
        setIsUser(isUser === 'true');
    }, [setIsAdmin, setIsUser]);

    const handleLogout = () => {
        // Clear values from local storage
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isUser');
        localStorage.removeItem('id_registration');
        // Reset context values
        setIsAdmin(false);
        setIsUser(false);

        // Navigate to the login page
        navigate('/login');
    };
    return (
        <div className={css.Header}>
            {isAdmin && (
                <div className={css.navigator}>
                    <NavLink to={'admin'}>Хто зробив Запис на донорство</NavLink>
                    <button onClick={handleLogout}>Вийти</button>
                </div>
            )}

            {isUser && (
                <div className={css.navigator}>
                    <NavLink to={`/registration-donation/${localStorage.getItem('id_registration')}`}>Зробити запис</NavLink>
                    <button onClick={handleLogout}>Вийти</button>
                    <div>
                        <NavLink to={`/donor/${localStorage.getItem('id_registration')}`}><img alt={'account'}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAu0lEQVR4nO2U0QnCMBRFzwQdQOufpcPoKrqG6CgSOoMWl1DoCIIt6G+k8AoaNKnk9UP0wv1JyjmkLy38SiaAARppAeSa8DNgnbZrqYbAvIB33WoIGo+g1hDYQAc9wUVDUHgE7Xyik3tuUYZSUrkxtdRowr83Y2ADVEAJJA97iaxV8szoU/gSuDlD3QFTefd7Z+8KLPrC1z0+LvumqxB8HgG30plPcFIQHH2CWLgN/Z8GFxwU4GVgzv/wlDuj6q8tGM8DawAAAABJRU5ErkJggg=="/>
                        </NavLink>
                    </div>
                </div>
            )}

            {!isAdmin && !isUser && (
                <div className={css.navigator}>
                    <NavLink to={'informations'}>Загальна інформація</NavLink>
                    <NavLink to={'confirmation'}>Запис на донорство</NavLink>
                    <NavLink to={'login'}>Увійти</NavLink>
                    <NavLink to={'register'}>Реєстрація</NavLink>
                </div>
            )}
        </div>
    );
};

export {Header};