import {useAuthContext} from "../../hoc/AuthContext";
import {NavLink} from "react-router-dom";
import {supabase} from "../../constans/dT";
import {useEffect, useState} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import customFont from './custom_font.js'



const Admin = () => {
    const { isAdmin } = useAuthContext();
    const [rentedData, setRentedData] = useState<any[]>([]);
    const [notRentedData, setNotRentedData] = useState<any[]>([]);
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
                .select('hour_id, hour_value, day_id, id_registration, rented') // Добавляем rented в выборку
                .not('id_registration', 'is', null);

            if (hoursError) {
                throw hoursError;
            }

            const rentedEntries = [];
            const notRentedEntries = [];

            for (const hour of hours) {
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
                    .select('month_name, id_place, month_value')
                    .eq('month_id', day.month_id)
                    .single();

                if (monthError || !month) {
                    throw monthError || new Error('Month data is null');
                }

                const { data: place, error: placeError } = await supabase
                    .from('place')
                    .select('address, eng_address')
                    .eq('id_place', month.id_place)
                    .single();

                if (placeError || !place) {
                    throw placeError || new Error('Place data is null');
                }

                const { data: user, error: userError } = await supabase
                    .from('user')
                    .select('name, surname, age')
                    .eq('id_registration', hour.id_registration)
                    .single();

                if (userError || !user) {
                    throw userError || new Error('User data is null');
                }

                const timeEntry = {
                    hour_id: hour.hour_id,
                    hour_value: hour.hour_value,
                    day_value: day.day_value,
                    month_name: month.month_name,
                    month_value:month.month_value,
                    place_address: place.address,
                    eng_address:place.eng_address,
                    user: user,
                    rented: hour.rented
                };

                if (timeEntry.rented) {
                    rentedEntries.push(timeEntry);
                } else {
                    notRentedEntries.push(timeEntry);
                }
            }

            setRentedData(rentedEntries);
            setNotRentedData(notRentedEntries);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Ошибка при получении данных о времени');
        }
    };

    const deleteRecord = async (hourId: number) => {
        try {
            await supabase
                .from('hours')
                .update({ id_registration: null })
                .eq('hour_id', hourId);

            fetchTimeData();
        } catch (error) {
            setErrorMessage('Ошибка при удалении записи: ');
        }
    };
    const markAsRented = async (hourId: number) => {
        try {
            await supabase
                .from('hours')
                .update({ rented: true }) // Устанавливаем rented в значение true
                .eq('hour_id', hourId);

            fetchTimeData(); // Повторно загружаем данные после обновления
        } catch (error) {
            setErrorMessage('Ошибка при обновлении записи: ');
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Додаємо шрифт до jsPDF
        doc.addFileToVFS('CustomFont.ttf', customFont);
        doc.addFont('CustomFont.ttf', 'CustomFont', 'normal');
        doc.setFont('CustomFont'); // Встановлюємо шрифт для документу

        const tableColumn = ["Time", "Day", "Month", "Place", "Donor", "Status"];
        const tableRows:any = [];

        rentedData.forEach(timeEntry => {
            const timeData = [
                timeEntry.hour_value,
                timeEntry.day_value,
                timeEntry.month_value,
                timeEntry.eng_address,
                `${timeEntry.user.name} ${timeEntry.user.surname}, Age: ${timeEntry.user.age}`,
                "Rented"
            ];
            tableRows.push(timeData);
        });

        notRentedData.forEach(timeEntry => {
            const timeData = [
                timeEntry.hour_value,
                timeEntry.day_value,
                timeEntry.month_value,
                timeEntry.eng_address,
                `${timeEntry.user.name} ${timeEntry.user.surname}, Age: ${timeEntry.user.age}`,
                "Not Rented"
            ];
            tableRows.push(timeData);
        });

        doc.text("Reporting of donors", 14, 15);
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("donors_report.pdf");
    };

    return (
        <div>
            {isAdmin ? (
                <>
                    <h2>Записи на донорство</h2>
                    <h3>Не здано</h3>
                    {notRentedData.length > 0 ? (
                        <ul>
                            {notRentedData.map((timeEntry, index) => (
                                <li key={index}>
                                    Час: {timeEntry.hour_value}, День: {timeEntry.day_value},
                                    Місяць: {timeEntry.month_name}, Місце: {timeEntry.place_address}
                                    {timeEntry.user && (
                                        <div>
                                            Донор: {timeEntry.user.name} {timeEntry.user.surname},
                                            Вік: {timeEntry.user.age}
                                        </div>
                                    )}
                                    <button onClick={() => markAsRented(timeEntry.hour_id)}>Здано кров</button>
                                    <button onClick={() => deleteRecord(timeEntry.hour_id)}>Видалити запис</button>
                                    <hr/>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Донорів на запис немає</p>
                    )}
                    <h3>Здано</h3>
                    {rentedData.length > 0 ? (
                        <ul>
                            {rentedData.map((timeEntry, index) => (
                                <li key={index}>
                                    Час: {timeEntry.hour_value}, День: {timeEntry.day_value},
                                    Місяць: {timeEntry.month_name}, Місце: {timeEntry.place_address}
                                    {timeEntry.user && (
                                        <div>
                                            Донор: {timeEntry.user.name} {timeEntry.user.surname},
                                            Вік: {timeEntry.user.age}
                                        </div>
                                    )}
                                    <hr/>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Донорів немає</p>
                    )}
                </>
            ) : (
                <p>
                    <NavLink to={'/login'}>Авторизуйтесь</NavLink>, чтобы просматривать данные администратора.
                </p>
            )}
            <button onClick={generatePDF}>Експорт у PDF</button>
            {errorMessage && <p>{errorMessage}</p>}


        </div>
    );
};

export {Admin};