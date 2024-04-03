import {useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {useParams} from "react-router-dom";

const RegistrationDonation = () => {
    const { id_registration } = useParams<{ id_registration: string }>();
    const [months, setMonths] = useState<any[]>([]);
    const [days, setDays] = useState<any[]>([]);
    const [hours, setHours] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: monthsData, error: monthsError } = await supabase
                .from('months')
                .select('*');

            if (monthsError) {
                throw monthsError;
            }
            setMonths(monthsData);
        } catch (error) {
            setErrorMessage('Ошибка при получении месяцев');
        }
    };

    const handleMonthClick = async (monthId: number) => {
        try {
            const { data: daysData, error: daysError } = await supabase
                .from('days')
                .select('*')
                .eq('month_id', monthId);

            if (daysError) {
                throw daysError;
            }
            setDays(daysData);
            setSelectedMonth(monthId);
            setSelectedDay(null);
        } catch (error) {
            setErrorMessage('Ошибка при получении дней');
        }
    };

    const handleDayClick = async (dayId: number) => {
        try {
            const { data: hoursData, error: hoursError } = await supabase
                .from('hours')
                .select('*')
                .eq('day_id', dayId)
                .is('id_registration', null);


            if (hoursError) {
                throw hoursError;
            }
            setHours(hoursData);
            setSelectedDay(dayId);
            setErrorMessage('');
        } catch (error) {
            setHours([]);
            setErrorMessage('На выбранную дату записей нет');
        }
    };
    const handle = async (id_registration: string | undefined) => {
        try {
            const registrationId = id_registration ? parseInt(id_registration) : undefined;
            const { data: hoursData, error } = await supabase
                .from('hours')
                .insert({id_registration: registrationId })

        } catch (error) {
            setHours([]);
            setErrorMessage('Ошибка при добавлении записи');
        }
    };

    return (
        <div>
            <h2>Місяці</h2>
            <div>
                {months.map(month => (
                    <button
                        key={month.month_id}
                        onClick={() => handleMonthClick(month.month_id)}
                        style={{ marginRight: '10px', marginBottom: '10px' }}
                    >
                        {month.month_name}
                    </button>
                ))}
            </div>
            {selectedMonth && (
                <>
                    <h2>Дні</h2>
                    <div>
                        {days.length > 0 ? (
                            days.map(day => (
                                <button
                                    key={day.day_id}
                                    onClick={() => handleDayClick(day.day_id)}
                                    style={{ marginRight: '10px', marginBottom: '10px' }}
                                >
                                    День {day.day_value}
                                </button>
                            ))
                        ) : (
                            <p>На обраний день немає вільного місця</p>
                        )}
                    </div>
                </>
            )}
            {selectedDay && (
                <>
                    <h2>Час для запису</h2>
                    {hours.length > 0 ? (
                        <ul>
                            {hours.map(hour  => (
                                <button onClick={()=>handle(id_registration)}>
                                    <li key={hour.hour_id}>Час {hour.hour_value}</li>
                                </button>
                            ))}
                        </ul>
                    ) : (
                        <p>На обраний день немає вільного часу</p>
                    )}
                </>
            )}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};



export {RegistrationDonation};