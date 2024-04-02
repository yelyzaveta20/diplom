import {FormEvent, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {supabase} from "../../constans/dT";

const RecordAuth = () => {
    const navigate = useNavigate();
    const { id_registration } = useParams<{ id_registration: string }>();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [age, setAge] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const namePattern = /^[А-Яа-яЁёҐґІіЇїЄєA-Za-z\s']+$/;
    const agePattern = /^(1[8-9]|[2-9][0-9]|100)$/;
    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!namePattern.test(name)) {
            setErrorMessage('Некоректне ім\'я. Використовуйте лише букви.');
            return;
        }

        if (!namePattern.test(surname)) {
            setErrorMessage('Некоректне прізвище. Використовуйте лише букви.');
            return;
        }

        if (!agePattern.test(age)) {
            setErrorMessage('Некоректний вік. Введіть вік від 18 до 100.');
            return;
        }
        try {
            // Insert user data into the database
            const { data: newUser, error } = await supabase
                .from('user')
                .insert([
                    { id_registration: id_registration, name: name, surname: surname, age: age },
                ])
                .select();

            if (error) {
                throw error;
            }

            console.log('User data saved:', newUser);
            // Optionally, you can redirect the user to a different page upon successful submission
            navigate(`/donor/${id_registration}`);
        } catch (error) {
            console.error('Error saving user data:', error);
            // Handle error if needed
        }
    };

    return (
        <div>
            <p>
                Ім'я та прізвище має бути українськими літерами, а вік від 18 років
            </p>
            <form onSubmit={handleFormSubmit}>
                <input type="text" placeholder="Введіть ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} pattern="[A-Za-zА-Яа-яЁё]{2,20}" />
                <input type="text" placeholder="Введіть ваше прізвище" value={surname} onChange={(e) => setSurname(e.target.value)} pattern="[A-Za-zА-Яа-яЁё]{2,20}"/>
                <input type="text" placeholder="Введіть ваш вік" value={age} onChange={(e) => setAge(e.target.value)} pattern="[(1[8-9]|[2-9][0-9]|100)]"/>
                <button type="submit">Зберегти</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};
export {RecordAuth};