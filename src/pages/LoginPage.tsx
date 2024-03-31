import {Login} from "../components/FormContainer/Loginations/Login";
import {supabase} from "../constans/dT";
import {useEffect, useState} from "react";
import {Reg} from "../components/Reg";



const LoginPage = () => {

    return (
        <div>
            <Login/>
            <Reg/>
        </div>
    );
};

export {LoginPage};