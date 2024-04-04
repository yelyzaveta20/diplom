import {useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {NavLink, useParams} from "react-router-dom";

const RegistrationDonation = () => {
    const { id_registration } = useParams<{ id_registration: string }>();
    const [isRecorded, setIsRecorded] = useState<boolean>(false);
    const [months, setMonths] = useState<any[]>([]);
    const [days, setDays] = useState<any[]>([]);
    const [hours, setHours] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedHourId, setSelectedHourId] = useState<number | null>(null);
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
            setSelectedHourId(null);
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
            setSelectedHourId(null);
            setErrorMessage('');
        } catch (error) {
            setHours([]);
            setErrorMessage('На выбранную дату записей нет');
        }
    };

    const handleHourClick = (hourId: number) => {
        setSelectedHourId(hourId);
    };

    const handle = async () => {
        try {
            if (selectedHourId === null) {
                throw new Error('Не выбрано время для записи');
            }

            const registrationId = id_registration ? parseInt(id_registration) : undefined;

            await supabase
                .from('hours')
                .update({ id_registration: registrationId })
                .eq('hour_id', selectedHourId);

            // Обновить hours, чтобы увидеть изменения после записи
            const { data: updatedHoursData } = await supabase
                .from('hours')
                .select('*')
                .eq('day_id', selectedDay)
                .is('id_registration', null);


            setIsRecorded(true); // Установить флаг успешной записи
            setErrorMessage(''); // Сбросить сообщение об ошибке
        } catch (error) {
            setIsRecorded(false); // Установить флаг успешной записи в false в случае ошибки
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
                            {hours.map(hour => (
                                <button
                                    key={hour.hour_id}
                                    onClick={() => handleHourClick(hour.hour_id)}
                                    style={{ marginRight: '10px', marginBottom: '10px' }}
                                >
                                    Час {hour.hour_value}
                                </button>
                            ))}
                        </ul>
                    ) : (
                        <p>На обраний день немає вільного часу</p>
                    )}
                </>
            )}
            {selectedHourId !== null && (
                <>
                    <button onClick={handle}>Записатися</button>
                </>
            )}
            {isRecorded && <p>Запис успішно зроблено, перейдіть до особистого кабінету щоб переглянути інфорацію <NavLink
                to={`/donor/${localStorage.getItem('id_registration')}`}>
                <img alt={'account'}
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAu0lEQVR4nO2U0QnCMBRFzwQdQOufpcPoKrqG6CgSOoMWl1DoCIIt6G+k8AoaNKnk9UP0wv1JyjmkLy38SiaAARppAeSa8DNgnbZrqYbAvIB33WoIGo+g1hDYQAc9wUVDUHgE7Xyik3tuUYZSUrkxtdRowr83Y2ADVEAJJA97iaxV8szoU/gSuDlD3QFTefd7Z+8KLPrC1z0+LvumqxB8HgG30plPcFIQHH2CWLgN/Z8GFxwU4GVgzv/wlDuj6q8tGM8DawAAAABJRU5ErkJggg=="/>
            </NavLink></p>}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};


export {RegistrationDonation};