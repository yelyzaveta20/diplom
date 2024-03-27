import {useNavigate} from "react-router-dom";
import css from './Login.module.css'
const Login = () => {
    let navigate = useNavigate();
    const handle=()=>{
     navigate('/register')
    }
    return (
        <div >
            <p>Вхід</p>
            <form>
                <input type="text" placeholder="Введіть ваш логін"/>
                <input type="text" placeholder="Введіть ваш пароль"/>
                <button>Увійти</button>
                <button onClick={handle}>Зареєструватися</button>
            </form>
        </div>
    );
};

export {Login};