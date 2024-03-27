import {NavLink} from "react-router-dom";
import css from './Header.module.css'
const Header = () => {
    return (
        <div className={css.Header}>
            <div className={css.navigator}>
                <NavLink to={'informations'}>Загальна інформація</NavLink>
                <NavLink to={'confirmation'}>Запис на донорство</NavLink>
            </div>
            <div className={css.navigator} >
                <NavLink to={'login'}>Увійти</NavLink>
                <NavLink to={'register'}>Реєстрація</NavLink>
            </div>

        </div>
    );
};

export {Header};