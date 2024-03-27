import {NavLink} from "react-router-dom";

const Confirmation = () => {
    return (
        <div>
            <NavLink to={'/informations'}>Не погоджуюсь</NavLink>
            <NavLink to={'/record'}>Погоджуюсь</NavLink>
        </div>
    );
};

export {Confirmation};