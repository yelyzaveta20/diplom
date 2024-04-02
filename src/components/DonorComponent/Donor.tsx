import {FormEvent, useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {useAuthContext} from "../../constans/AuthContext";
import {useParams} from "react-router-dom";
import {IDonor} from "./InterfaseDonr";

const Donor = () => {
    const { id_registration } = useParams<{ id_registration: string }>(); // Get id_registration from the URL
    const [userData, setUserData] = useState<any>(null); // State to store user data
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [id_registration]); // Fetch data whenever id_registration changes

    const fetchData = async () => {
        try {
            // Fetch user data from the database
            const { data: useraccount, error } = await supabase
                .from('user')
                .select('*');

            if (error) {
                throw error;
            }

            // Find the user whose id_registration matches the one from the URL
            const matchedUser = useraccount.find((user: any) =>(user.id_registration.toString()) === id_registration)

            if (matchedUser) {
                // Set the matched user data to the state
                setUserData(matchedUser);
            } else {
                // If no user matches the id_registration, set an error message
                setErrorMessage('Пользователь с указанным id_registration не найден');
            }
        } catch (error) {
            setErrorMessage('Ошибка при получении информации о пользователе');
        }
    };

    return (
        <div>
            <h2>Донор</h2>
            {userData && (
                <div>
                    <p>Имя: {userData.name}</p>
                    <p>Фамилия: {userData.surname}</p>
                    <p>Возраст: {userData.age}</p>
                </div>
            )}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export {Donor};