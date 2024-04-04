import {useAuthContext} from "../constans/AuthContext";
import {NavLink} from "react-router-dom";
import {supabase} from "../constans/dT";
import {useEffect, useState} from "react";

const Admin = () => {
    const { isAdmin } = useAuthContext();
    const [timeData, setTimeData] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchTimeData();
        }
    }, [isAdmin]);

    const fetchTimeData = async () => {
        try {
            const { data: hours, error: hoursError } = await supabase
                .from('hours')
                .select('hour_id, hour_value, day_id, id_registration')
                .not('id_registration', 'is', null);

            if (hoursError) {
                throw hoursError;
            }

            // Для каждой записи времени получить день и месяц из таблиц 'days' и 'months'
            const timeWithDetails = await Promise.all(hours.map(async (hour: any) => {
                const { data: day, error: dayError } = await supabase
                    .from('days')
                    .select('day_value, month_id')
                    .eq('day_id', hour.day_id)
                    .single();

                if (dayError || !day) {
                    throw dayError || new Error('Day data is null');
                }

                const { data: month, error: monthError } = await supabase
                    .from('months')
                    .select('month_name')
                    .eq('month_id', day.month_id)
                    .single();

                if (monthError || !month) {
                    throw monthError || new Error('Month data is null');
                }

                // Получить данные пользователя на основе id_registration
                const { data: user, error: userError } = await supabase
                    .from('user')
                    .select('name, surname, age')
                    .eq('id_registration', hour.id_registration)
                    .single();

                if (userError || !user) {
                    throw userError || new Error('User data is null');
                }

                return {
                    hour_id: hour.hour_id,
                    hour_value: hour.hour_value,
                    day_value: day.day_value,
                    month_name: month.month_name,
                    user: user
                };
            }));

            // Устанавливаем данные времени с дополнительными деталями в состояние
            setTimeData(timeWithDetails);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Ошибка при получении данных о времени');
        }
    };
    const deleteRecord = async (index: number) => {
        try {

            const hour_idToDelete = timeData[index]?.hour_id; // Используем оператор опциональной последовательности для избежания ошибок, если timeData[index] равен undefined

            if (hour_idToDelete === undefined) {
                throw new Error("hour_id не найден");
            }

            await supabase
                .from('hours')
                .update({ id_registration: null })
                .eq('hour_id', hour_idToDelete);

            // Обновить данные после удаления записи
            fetchTimeData();
        } catch (error) {
            setErrorMessage('Ошибка при удалении записи: ');
        }
    };
    return (
        <div>
            {isAdmin ? (
                <>
                    <h2>Записи на донорство</h2>
                    <ul>
                        {timeData.map((timeEntry, index) => (
                            <li key={index}>
                                Время: {timeEntry.hour_value}, День: {timeEntry.day_value},
                                Месяц: {timeEntry.month_name}
                                {timeEntry.user && (
                                    <div>
                                        Пользователь: {timeEntry.user.name} {timeEntry.user.surname},
                                        Возраст: {timeEntry.user.age}
                                    </div>
                                )}
                                <button>Здано</button>
                                <button onClick={() => deleteRecord(index)}>Видалити</button>
                                <hr/>
                            </li>

                        ))}
                    </ul>
                </>
            ) : (
                <p>
                    <NavLink to={'/login'}>Авторизуйтесь</NavLink>, чтобы просматривать данные администратора.
                </p>
            )}
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export {Admin};