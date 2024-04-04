import {FormEvent, useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {useAuthContext} from "../../constans/AuthContext";
import {useParams} from "react-router-dom";
import {IDonor} from "./InterfaseDonr";

const Donor = () => {
    const { id_registration } = useParams<{ id_registration: string }>();
    const [userData, setUserData] = useState<any>(null);
    const [donationData, setDonationData] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, [id_registration]);

    const fetchData = async () => {
        try {
            // Fetch user data from the database
            const { data: useraccount, error: userError } = await supabase
                .from('user')
                .select('*')
                .eq('id_registration', id_registration);

            if (userError) {
                throw userError;
            }

            if (useraccount && useraccount.length > 0) {
                // Set the user data to the state
                setUserData(useraccount[0]);

                // Fetch donation data from the database
                const { data: hoursData, error: hoursError } = await supabase
                    .from('hours')
                    .select('*')
                    .eq('id_registration', id_registration);

                if (hoursError) {
                    throw hoursError;
                }

                // Fetch days data from the database
                const { data: daysData, error: daysError } = await supabase
                    .from('days')
                    .select('*');

                if (daysError) {
                    throw daysError;
                }

                // Fetch months data from the database
                const { data: monthsData, error: monthsError } = await supabase
                    .from('months')
                    .select('*');

                if (monthsError) {
                    throw monthsError;
                }

                // Combine donation data with day and month information
                const donationWithDetails = hoursData.map((hour: any) => {
                    const day = daysData.find((day: any) => day.day_id === hour.day_id);
                    const month = monthsData.find((month: any) => month.month_id === day.month_id);
                    return {
                        hour_value: hour.hour_value,
                        day_value: day.day_value,
                        month_name: month.month_name,
                    };
                });

                // Set the donation data with details to the state
                setDonationData(donationWithDetails);
            } else {
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
            <h3>Записи на донорство:</h3>
            {donationData.length > 0 ? (
                <ul>
                    {donationData.map((donation: any, index: number) => (
                        <li key={index}>
                            Місяць: {donation.month_name}, День: {donation.day_value}, Час: {donation.hour_value}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{errorMessage}</p>
            )}
        </div>
    );
};

export {Donor};