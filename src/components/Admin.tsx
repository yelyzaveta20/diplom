import {useAuthContext} from "../constans/AuthContext";
import {NavLink} from "react-router-dom";

const Admin = () => {
    const {isAdmin} = useAuthContext();

    return (
        <div>
            {isAdmin?(
                <p>ок</p>
            ):(
                <NavLink to={'/login'}>Авторезуйтеся</NavLink>
            )}
        </div>
    );
};

export {Admin};