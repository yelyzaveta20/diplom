import {useAuthContext} from "../../hoc/AuthContext";
import {NavLink} from "react-router-dom";
import {supabase} from "../../constans/dT";
import {useEffect, useState} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import customFont from './custom_font.js'
import css from './Admin.module.css'


const Admin = () => {
    const { isAdmin } = useAuthContext();
    const [rentedData, setRentedData] = useState<any[]>([]);
    const [notRentedData, setNotRentedData] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading status
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [monthsList, setMonthsList] = useState<any[]>([]);
    const [pdfRentedFilter, setPdfRentedFilter] = useState<string>('all');

    useEffect(() => {
        if (isAdmin) {
            fetchMonths();
            fetchTimeData();
        }
    }, [isAdmin]);

    const fetchMonths = async () => {
        try {
            const { data: months, error } = await supabase
                .from('months')
                .select('month_name, month_value');
            if (error) throw error;
            setMonthsList(months);
        } catch (error) {
            setErrorMessage('Ошибка при получении данных месяцев');
        }
    };
    const fetchTimeData = async () => {
        setLoading(true);
        try {
            const { data: hours, error: hoursError } = await supabase
                .from('hours')
                .select('hour_id, hour_value, day_id, id_registration, rented')
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

                if (selectedMonth && day.month_id !== selectedMonth) {
                    continue;
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
                    .select('name, surname, age, telnumber')
                    .eq('id_registration', hour.id_registration)
                    .single();

                if (userError || !user) {
                    throw userError || new Error('User data is null');
                }
                let loginValue = 'No login';
                const { data: registration, error: registrationError } = await supabase
                    .from('registration')
                    .select('login')  // Assuming a relationship is set up
                    .eq('id_registration', hour.id_registration)
                    .single();

                if (registrationError) {
                    throw registrationError;
                }

                if (registration && registration.login) {
                    loginValue = registration.login; // Use fetched login if available
                }

                if (userError || !user) {
                    throw userError || new Error('User data is null');
                }

                const timeEntry = {
                    hour_id: hour.hour_id,
                    hour_value: hour.hour_value,
                    day_value: day.day_value,
                    month_name: month.month_name,
                    month_value: month.month_value,
                    place_address: place.address,
                    eng_address: place.eng_address,
                    user: user,
                    rented: hour.rented,
                    login: loginValue,
                    telnumber:user.telnumber

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
        } finally {
            setLoading(false); // End loading
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
        doc.addFileToVFS('CustomFont.ttf', customFont);
        doc.addFont('CustomFont.ttf', 'CustomFont', 'normal');
        doc.setFont('CustomFont');

        const tableColumn = ["Time", "Day", "Month", "Place", "Donor", "Phone", "Status"];
        const tableRows:any = [];

        const dataToInclude = pdfRentedFilter === 'all' ? [...rentedData, ...notRentedData]
            : pdfRentedFilter === 'rented' ? rentedData
                : notRentedData;

        dataToInclude.forEach(timeEntry => {
            const timeData = [
                timeEntry.hour_value,
                timeEntry.day_value,
                timeEntry.month_value,
                timeEntry.eng_address,
                timeEntry.login, // Login from registration
                timeEntry.user.telnumber, // Phone number from user
                timeEntry.rented ? "Rented" : "Not Rented"
            ];
            tableRows.push(timeData);
        });

        doc.text("Reporting of donors", 14, 15);
        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("donors_report.pdf");
    };

    return (
        <div className={css.container}>
            {isAdmin ? (
                <>
                    <h2 className={css.header}>Записи на донорство</h2>
                    {loading ? (
                        <p>Дані завантажуються...</p>
                    ) : (
                        <>
                            <div className={css.selectBox}>
                                <p>Оберіть місяць на котрий хочете переглянути донорів</p>
                                <select value={selectedMonth || ''} className={css.select}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                                    <option value="">Оберіть місяць</option>
                                    {monthsList.map((month) => (
                                        <option key={month.month_value} value={month.month_value}>
                                            {month.month_name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={fetchTimeData}>Показати донорів за конкретний місяць</button>
                            </div>
                            <div className={css.donationSections}>
                                <div className={css.section}>
                                    <h3>Не здано</h3>
                                    {notRentedData.length > 0 ? (
                                        <ul className={css.list}>
                                            {notRentedData.map((timeEntry, index) => (
                                                <li key={index} className={css.listItem}>
                                                    Час: {timeEntry.hour_value}, <br/>
                                                    День: {timeEntry.day_value}, <br/>
                                                    Місяць: {timeEntry.month_name}, <br/>
                                                    Місце: {timeEntry.place_address}
                                                    {timeEntry.user && (
                                                        <div>
                                                            Донор: {timeEntry.user.name} {timeEntry.user.surname}, <br/>
                                                            Вік: {timeEntry.user.age}
                                                        </div>
                                                    )}
                                                    <button onClick={() => markAsRented(timeEntry.hour_id)}
                                                            className={css.button}>Здано кров
                                                    </button>
                                                    <button onClick={() => deleteRecord(timeEntry.hour_id)}
                                                            className={css.button}>Видалити запис
                                                    </button>
                                                    <hr/>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p>Донорів на запис немає</p>}
                                </div>
                                <div className={css.section}>
                                    <h3>Здано</h3>
                                    {rentedData.length > 0 ? (
                                        <ul className={css.list}>
                                            {rentedData.map((timeEntry, index) => (
                                                <li key={index} className={css.listItem}>
                                                    Час: {timeEntry.hour_value}, <br/>
                                                    День: {timeEntry.day_value}, <br/>
                                                    Місяць: {timeEntry.month_name}, <br/>
                                                    Місце: {timeEntry.place_address}
                                                    {timeEntry.user && (
                                                        <div>
                                                            Донор: {timeEntry.user.name} {timeEntry.user.surname}, <br/>
                                                            Вік: {timeEntry.user.age}
                                                        </div>
                                                    )}
                                                    <hr/>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p>Донорів немає</p>}
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <p><NavLink to={'/login'}>Авторизуйтесь</NavLink>, чтобы просматривать данные администратора.</p>
            )}
            <div>
                <h3 className={css.reportOptions}>Зробити звіт:</h3>
                <label>
                    <input type="radio" value="all" checked={pdfRentedFilter === 'all'}
                           onChange={() => setPdfRentedFilter('all')}/> Усі донорства
                </label>
                <label>
                    <input type="radio" value="rented" checked={pdfRentedFilter === 'rented'}
                           onChange={() => setPdfRentedFilter('rented')} className={css.input}/> Виконані донорства
                </label>
                <label>
                    <input type="radio" value="notRented" checked={pdfRentedFilter === 'notRented'}
                           onChange={() => setPdfRentedFilter('notRented')}/> Записи на донорства
                </label>
            </div>
            <button className={css.button} onClick={generatePDF}>Експорт у PDF</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export {Admin};