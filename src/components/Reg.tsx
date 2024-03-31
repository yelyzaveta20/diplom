import {useEffect, useState} from "react";
import {supabase} from "../constans/dT";
import {IUser} from "../interfase/userInterfase";
import {useNavigate} from "react-router-dom";

const Reg = () => {
    // const [registrations, setRegistrations] = useState<IUser[] | null>(null);
    // const [error, setError] = useState<string | null>(null);
    // console.log(supabase)
    // let navigate = useNavigate();
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const { data: registration, error } = await supabase
    //                 .from('registration')
    //                 .select('*');
    //
    //             console.log({data: registration});
    //
    //             if (error) {
    //                 throw error;
    //             }
    //
    //             setRegistrations(registration);
    //             const isAdmin = registration.some(user => user.login === 'admin' && user.password === 'admin');
    //
    //             // Если найдены записи с логином и паролем "admin", перенаправляем на страницу администратора
    //             if (isAdmin) {
    //                 navigate('/admin')
    //             }
    //         } catch (error) {
    //             // console.error('Error fetching registrations:', error.message);
    //             setError('An error occurred while fetching registrations');
    //         }
    //     };
    //
    //     fetchData();
    // }, []);

    return (
        <div>

        </div>
    );
};

export {Reg};