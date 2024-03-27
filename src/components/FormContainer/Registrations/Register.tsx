import {useNavigate} from "react-router-dom";

const Register = () => {
    let navigate = useNavigate();
    const handle=()=>{
        navigate('/login')
    }
    return (
        <div>
            <p>Реєстрація</p>
            <form>
                <input type="text" placeholder="Напишіть ваш логін"/>
                <input type="text" placeholder="Напишіть ваш пароль"/>
                <button>Зареєструватися</button>
                <button onClick={handle}>Увійти</button>
            </form>
        </div>
    );
};

export {Register};