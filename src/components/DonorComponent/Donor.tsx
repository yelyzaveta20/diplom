import {FormEvent, useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {useAuthContext} from "../../hoc/AuthContext";
import {useParams} from "react-router-dom";
import {IDonor} from "./InterfaseDonr";
import css from './Donor.module.css'

const Donor = () => {
    const { id_registration } = useParams<{ id_registration: string }>();
    const [userData, setUserData] = useState<any>(null);
    // const [donationData, setDonationData] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [donationData, setDonationData] = useState<{ rentedEntries: any[]; notRentedEntries: any[] }>({ rentedEntries: [], notRentedEntries: [] });
    useEffect(() => {
        const storedId = localStorage.getItem('id_registration');
        if (!storedId && id_registration) {
            localStorage.setItem('id_registration', id_registration);
        }
        fetchData();
    }, [id_registration]);

    const fetchData = async () => {
        try {
            const { data: useraccount, error: userError } = await supabase
                .from('user')
                .select('*')
                .eq('id_registration', id_registration);

            if (userError) throw userError;

            if (useraccount && useraccount.length > 0) {
                setUserData(useraccount[0]);

                const { data: hoursData, error: hoursError } = await supabase
                    .from('hours')
                    .select('*')
                    .eq('id_registration', id_registration);

                if (hoursError) throw hoursError;

                const { data: daysData, error: daysError } = await supabase.from('days').select('*');
                if (daysError) throw daysError;

                const { data: monthsData, error: monthsError } = await supabase.from('months').select('*');
                if (monthsError) throw monthsError;

                const { data: placesData, error: placesError } = await supabase.from('place').select('*');
                if (placesError) throw placesError;

                const { data: weekdaysData, error: weekdaysError } = await supabase.from('weekday').select('*');
                if (weekdaysError) throw weekdaysError;

                const rentedEntries: any[] = [];
                const notRentedEntries: any[] = [];

                hoursData.forEach(hour => {
                    const day = daysData.find(day => day.day_id === hour.day_id);
                    const month = monthsData.find(month => month.month_id === day.month_id);
                    const place = placesData.find(place => place.id_place === month.id_place);
                    const weekday = weekdaysData.find(weekday => weekday.weekday_id === day.weekday_id);

                    const donationDetail = {
                        hour_id: hour.hour_id,
                        hour_value: hour.hour_value,
                        day_value: day.day_value,
                        month_name: month.month_name,
                        place_address: place.address,
                        weekday_name: weekday.weekday,
                        rented: hour.rented

                    };

                    if (hour.rented) {
                        rentedEntries.push(donationDetail);
                    } else {
                        notRentedEntries.push(donationDetail);
                    }
                });

                setDonationData({rentedEntries, notRentedEntries});
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
        <div className={css.container}>
            <h2 className={css.heading}>Донор</h2>
            {userData && (
                <div className={css.infoBlock}>
                    <p>Ім'я: {userData.name}</p>
                    <p>Прізвище: {userData.surname}</p>
                    <p>Вік: {userData.age}</p>
                    <p>Телефон: {userData.telnumber}</p>
                </div>
            )}

            <hr className={css.hr}/>
            <h3 className={css.heading}>Записи на донорство:</h3>
            <ul className={css.recordList}>
                {donationData.notRentedEntries && donationData.notRentedEntries.length > 0 ? (
                    donationData.notRentedEntries.map((donation, index) => (
                        <li key={index} className={css.recordItem}>
                            <p className={css.recordDetails}>
                                Місце: {donation.place_address}, <br/>
                                Місяць: {donation.month_name},<br/>
                                День: {donation.weekday_name}, {donation.day_value}, <br/>
                                Час: {donation.hour_value}
                            </p>
                            <button className={css.button} onClick={() => cancelDonation(donation.hour_id)}>Скасувати
                                запис
                            </button>
                        </li>
                    ))
                ) : <p>Немає незданих записів</p>}
            </ul>

            <hr className={css.hr}/>
            <h3 className={css.heading}>Проведені донорства:</h3>
            <ul className={css.recordList}>
                {donationData.rentedEntries && donationData.rentedEntries.length > 0 ? (
                    donationData.rentedEntries.map((donation, index) => (
                        <li key={index} className={css.recordItem}>
                            <p className={css.recordDetails}>
                                Місце: {donation.place_address},<br/>
                                Місяць: {donation.month_name},<br/>
                                День: {donation.weekday_name}, {donation.day_value},<br/>
                                Час: {donation.hour_value}
                            </p>
                        </li>
                    ))
                ) : <p>Немає записів про сдану кров</p>}
            </ul>
            <hr className={css.hr}/>
        </div>
    );
};
export {Donor};
