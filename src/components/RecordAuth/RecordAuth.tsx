import {FormEvent, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {supabase} from "../../constans/dT";
import css from './RecordAuth.module.css'

const RecordAuth = () => {
    const navigate = useNavigate();
    const { id_registration } = useParams<{  id_registration?: string }>();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [age, setAge] = useState('');
    const [telnumber, setTelnumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const namePattern = /^[А-Яа-яЁёЄєІіЇїҐґ\s'-]{2,}$/;
    const agePattern = /^(1[8-9]|[2-9][0-9]|100)$/;
    const telPattern = /^0\d{9}$/;

    // Check local storage for id_registration and store if not present
    useEffect(() => {
        const storedIdRegistration = localStorage.getItem('id_registration');
        if (!storedIdRegistration && id_registration) { // Check if id_registration is not undefined
            localStorage.setItem('id_registration', id_registration);
        }
    }, [id_registration]);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!namePattern.test(name)) {
            setErrorMessage('Некоректне ім\'я. Використовуйте лише українські літери.');
            return;
        }

        if (!namePattern.test(surname)) {
            setErrorMessage('Некоректне прізвище. Використовуйте лише українські літери.');
            return;
        }

        if (!agePattern.test(age)) {
            setErrorMessage('Некоректний вік. Введіть вік від 18 до 100.');
            return;
        }
        if (!telPattern.test(telnumber)) {
            setErrorMessage('Некоректний номер телефону. Використовуйте формат 0 XX XXX XXXX(9 цифр після нуля)');
            return;
        }
        try {
            const { data: newUser, error } = await supabase
                .from('user')
                .insert([
                    { id_registration: id_registration, name: name, surname: surname, age: age ,telnumber:telnumber},
                ]);

            if (error) {
                throw error;
            }

            console.log('User data saved:', newUser);
            navigate(`/donor/${id_registration}`);
        } catch (error) {
            console.error('Error saving user data:', error);
            setErrorMessage('Помилка при збереженні даних');
        }
    };

    return (
        <div className={css.Auth}>
            <div className={css.authinput}>
                <p className={css.authp}>
                    Ім'я та прізвище має бути українськими літерами, а вік від 18 років
                </p>
                <form className={css.formauth} onSubmit={handleFormSubmit}>
                    <input type="text" placeholder="Введіть ваше ім'я" value={name}
                           onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder="Введіть ваше прізвище" value={surname}
                           onChange={(e) => setSurname(e.target.value)}/>
                    <input type="text" placeholder="Введіть ваш вік" value={age}
                           onChange={(e) => setAge(e.target.value)}/>
                    <input type="tel" placeholder="Введіть ваш номер телефону" value={telnumber}
                           onChange={(e) => setTelnumber(e.target.value)}
                           title="Номер телефону повинен бути у форматі +380 XX XXX XXXX"/>
                    <br/>
                    <button className={css.authbutton} type="submit">Зберегти</button>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};
export {RecordAuth};