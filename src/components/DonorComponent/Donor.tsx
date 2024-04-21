import {FormEvent, useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {useAuthContext} from "../../hoc/AuthContext";
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
            const { data: useraccount, error: userError } = await supabase
                .from('user')
                .select('*')
                .eq('id_registration', id_registration);

            if (userError) {
                throw userError;
            }

            if (useraccount && useraccount.length > 0) {
                setUserData(useraccount[0]);

                const { data: hoursData, error: hoursError } = await supabase
                    .from('hours')
                    .select('*')
                    .eq('id_registration', id_registration);

                if (hoursError) {
                    throw hoursError;
                }

                const { data: daysData, error: daysError } = await supabase
                    .from('days')
                    .select('*');

                if (daysError) {
                    throw daysError;
                }

                const { data: monthsData, error: monthsError } = await supabase
                    .from('months')
                    .select('*');

                if (monthsError) {
                    throw monthsError;
                }

                const { data: placesData, error: placesError } = await supabase
                    .from('place')
                    .select('*');

                if (placesError) {
                    throw placesError;
                }

                const { data: weekdaysData, error: weekdaysError } = await supabase // Запрос к таблице weekdays
                    .from('weekday')
                    .select('*');

                if (weekdaysError) {
                    throw weekdaysError;
                }

                const donationWithDetails = hoursData.map((hour: any) => {
                    const day = daysData.find((day: any) => day.day_id === hour.day_id);
                    const month = monthsData.find((month: any) => month.month_id === day.month_id);
                    const place = placesData.find((place: any) => place.id_place === month.id_place);
                    const weekday = weekdaysData.find((weekday: any) => weekday.weekday_id === day.weekday_id); // Получаем день недели
                    return {
                        hour_id: hour.hour_id, // Добавляем ID записи
                        hour_value: hour.hour_value,
                        day_value: day.day_value,
                        month_name: month.month_name,
                        place_address: place.address,
                        weekday_name: weekday.weekday // Добавляем день недели к данным о донорстве
                    };
                });

                setDonationData(donationWithDetails);
            } else {
                setErrorMessage('Користувача с указанным id_registration не найден');
            }
        } catch (error) {
            setErrorMessage('Помилка при отриманні інформації про користувача');
        }
    };

    const cancelDonation = async (hourId: number) => {
        try {
            await supabase
                .from('hours')
                .update({ id_registration: null })
                .eq('hour_id', hourId);

            // После отмены записи обновляем данные
            fetchData();
        } catch (error) {
            setErrorMessage('Помилка при скасуванні запису');
        }
    };

    return (
        <div>
            <h2>Донор</h2>
            {userData && (
                <div>
                    <p>Ім'я: {userData.name}</p>
                    <p>Прізвище: {userData.surname}</p>
                    <p>Вік: {userData.age}</p>
                </div>
            )}
            <h3>Записи на донорство:</h3>
            {donationData.length > 0 ? (
                <ul>
                    {donationData.map((donation: any, index: number) => (
                        <li key={index}>
                            <p>
                                Місце: {donation.place_address}, <br/>
                                Місяць: {donation.month_name},<br/>
                                День: {donation.weekday_name}, {donation.day_value};<br/>
                                Час: {donation.hour_value}<br/>
                                <button onClick={() => cancelDonation(donation.hour_id)}>Скасувати запис</button>
                            </p>

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
