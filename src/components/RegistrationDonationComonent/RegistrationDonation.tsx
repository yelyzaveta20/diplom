import {useState} from "react";

const RegistrationDonation = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Добавляем состояние для выбранного года

    const months = [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];

    const daysInMonth = (year:any, month:any) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const days = Array.from({ length: daysInMonth(selectedYear, months.indexOf(selectedMonth)) }, (_, i) => i + 1);

    const times = [
        '09:00',  '10:00',  '11:00',
        '12:00', '13:00', '14:00', '15:00'
    ];

    const handleMonthChange = (event:any) => {
        const { value } = event.target;
        setSelectedMonth(value);
        // Сбрасываем выбранный день при изменении месяца
        setSelectedDay('');
    };

    const handleDayChange = (event:any) => {
        setSelectedDay(event.target.value);
    };

    const handleTimeChange = (event:any) => {
        setSelectedTime(event.target.value);
    };

    const handleYearChange = (event:any) => {
        const year = parseInt(event.target.value);
        if (year >= 2024 && year <= 2025) {
            setSelectedYear(year);
        } else {
            // Выводите сообщение об ошибке или просто не обновляйте состояние
            console.log("Пожалуйста, выберите год между 2024 и 2025");
        }
    };

    return (
        <div>
            <label htmlFor="yearDropdown">Оберіть рік:</label>
            <input type="number" id="yearDropdown" value={selectedYear} onChange={handleYearChange}/>

            <label htmlFor="monthDropdown">Оберіть місяць:</label>
            <select id="monthDropdown" value={selectedMonth} onChange={handleMonthChange}>
                <option value="">Оберіть місяць</option>
                {months.map((month, index) => (
                    <option key={month} value={month}>{month}</option>
                ))}
            </select>

            <label htmlFor="dayDropdown">Выберите день:</label>
            <select id="dayDropdown" value={selectedDay} onChange={handleDayChange}>
                <option value="">Оберіть день</option>
                {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>

            <label htmlFor="timeDropdown">Оберіть час:</label>
            <select id="timeDropdown" value={selectedTime} onChange={handleTimeChange}>
                <option value="">Оберіть час</option>
                {times.map(time => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>

            {selectedMonth && selectedDay && selectedTime && (
                <p>Обрано: {selectedMonth} {selectedDay}, {selectedTime}</p>
            )}
        </div>
    );
};

export {RegistrationDonation};