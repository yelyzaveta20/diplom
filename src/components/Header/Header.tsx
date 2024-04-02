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
                    <NavLink to={'record'}>Зробити запис</NavLink>
                    <button onClick={handleLogout}>Вийти</button>
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