import {useEffect, useState} from "react";
import {supabase} from "../../constans/dT";
import {NavLink, useParams} from "react-router-dom";
import css from './RegistrationDonation.module.css'

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
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
    const [weekdays, setWeekdays] = useState<any[]>([]); // Состояние для хранения списка дней недели




    useEffect(() => {
        fetchPlaces(); // Вызываем функцию получения списка мест
        fetchWeekdays(); // Вызываем функцию получения списка дней недели

    }, []);


    // Функция для получения списка мест
    const fetchPlaces = async () => {
        try {
            const { data: placesData, error: placesError } = await supabase
                .from('place')
                .select('*');

            if (placesError) {
                throw placesError;
            }
            setPlaces(placesData);
        } catch (error) {
            setErrorMessage('Ошибка при получении списка мест');
        }
    };

    // Функция для получения списка дней недели
    const fetchWeekdays = async () => {
        try {
            const { data: weekdaysData, error: weekdaysError } = await supabase
                .from('weekday')
                .select('*');

            if (weekdaysError) {
                throw weekdaysError;
            }
            setWeekdays(weekdaysData);
        } catch (error) {
            setErrorMessage('Ошибка при получении списка дней недели');
        }
    };

    // Функция для обработки выбора места
    const handlePlaceClick = (placeId: number) => {

        setSelectedPlace(placeId);
        setMonths([]);
        setSelectedMonth(null);
        setDays([]);
        setSelectedDay(null);
        setSelectedHourId(null);
        fetchData(placeId);
    };

    // Функция для получения данных о месяцах для выбранного места
    const fetchData = async (placeId: number) => {
        try {
            const { data: monthsData, error: monthsError } = await supabase
                .from('months')
                .select('*')
                .eq('id_place', placeId);

            if (monthsError) {
                throw monthsError;
            }

            const currentDate = new Date();
            const filteredMonths = monthsData.filter(month => {
                const monthIndex = new Date(Date.parse(month.month_value + ' 1, 2000')).getMonth();
                const monthDate = new Date(currentDate.getFullYear(), monthIndex, month.month_value);
                monthDate.setMonth(monthDate.getMonth() + 1);
                return monthDate >= currentDate;
            });

            setMonths(filteredMonths);
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

            // Получаем текущую дату
            const currentDate = new Date();
            // Получаем текущий месяц
            const currentMonth = currentDate.getMonth() + 1;
            // Получаем текущий день
            const currentDay = currentDate.getDate();

            let filteredDays = [];

            // Если выбранный месяц совпадает с текущим, фильтруем дни только для будущих дней
            if (monthId === currentMonth) {
                filteredDays = daysData.filter(day => {
                    return day.day_value > currentDay;
                });
            } else {
                filteredDays = daysData;
            }

            setDays(filteredDays);
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

            // Преобразуем строки времени в объекты времени и сортируем по возрастанию
            const sortedHoursData = hoursData
                .map(hour => ({ ...hour, hour_value: new Date(`2000-01-01T${hour.hour_value}`).getTime() }))
                .sort((a, b) => {
                    return a.hour_value - b.hour_value;
                })
                .map(hour => ({ ...hour, hour_value: new Date(hour.hour_value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));

            setHours(sortedHoursData);
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

            setIsRecorded(true);
            setErrorMessage('');
        } catch (error) {
            setIsRecorded(false);
            setErrorMessage('помилка при додаванні запису');
        }
    };

    return (
        <div className={css.container}>
            <h4 className={css.messege}>Донорство можно проводити не раніше ніж через 30 днів після останнього донорства!</h4>
            <h2 className={css.heading}>Місце:</h2>
            <div>
                {places.map(place => (
                    <button
                        key={place.id_place}
                        onClick={() => handlePlaceClick(place.id_place)}
                        className={css.button}
                    >
                        {place.address}
                    </button>
                ))}
            </div>
            {selectedPlace && (

                < >
                    <hr className={css.hr}/>
                    <h2 className={`${css.heading} `}>Місяць:</h2>
                    <div className={css.monthSection}>
                        {months.map(month => (
                            <button
                                key={month.month_id}
                                onClick={() => handleMonthClick(month.month_id)}
                                className={css.button}
                            >
                                {month.month_name}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {selectedMonth && (
                <>
                    <hr className={css.hr}/>
                    <h2 className={css.heading}>Дні:</h2>
                    <div>
                        {days.length > 0 ? (
                            days.map(day => {
                                const weekday = weekdays.find(w => w.weekday_id === day.weekday_id);
                                return (
                                    <button
                                        key={day.day_id}
                                        onClick={() => handleDayClick(day.day_id)}
                                        className={css.button}
                                    >
                                        День {day.day_value} ({weekday && weekday.weekday})
                                    </button>
                                );
                            })
                        ) : (
                            <p>На обраний день немає вільного місця</p>
                        )}
                    </div>
                </>
            )}

            {selectedDay && (
                <>
                    <hr className={css.hr}/>
                    <h2 className={css.heading}>Час для запису:</h2>
                    {hours.length > 0 ? (
                        <ul>
                            {hours.map(hour => (
                                <button
                                    key={hour.hour_id}
                                    onClick={() => handleHourClick(hour.hour_id)}
                                    className={css.button}
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
                    <button onClick={handle} className={css.buttonYes}>Записатися</button>
                </>
            )}
            {isRecorded &&
                <p className={css.message}>Запис успішно зроблено, перейдіть до особистого кабінету щоб переглянути
                    інформацію <NavLink
                        to={`/donor/${localStorage.getItem('id_registration')}`} className={css.navLink}>
                        <img alt={'account'}
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAu0lEQVR4nO2U0QnCMBRFzwQdQOufpcPoKrqG6CgSOoMWl1DoCIIt6G+k8AoaNKnk9UP0wv1JyjmkLy38SiaAARppAeSa8DNgnbZrqYbAvIB33WoIGo+g1hDYQAc9wUVDUHgE7Xyik3tuUYZSUrkxtdRowr83Y2ADVEAJJA97iaxV8szoU/gSuDlD3QFTefd7Z+8KLPrC1z0+LvumqxB8HgG30plPcFIQHH2CWLgN/Z8GFxwU4GVgzv/wlDuj6q8tGM8DawAAAABJRU5ErkJggg=="/>
                    </NavLink></p>
            }
            {errorMessage && <p className={css.error}>{errorMessage}</p>}
        </div>
    );
};


export {RegistrationDonation};