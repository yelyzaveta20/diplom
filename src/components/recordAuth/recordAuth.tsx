import {FormEvent, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {supabase} from "../../constans/dT";

const RecordAuth = () => {
    const navigate = useNavigate();
    const { id_registration } = useParams<{ id_registration: string }>();
    console.log(id_registration)
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [age, setAge] = useState('');

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
            <form onSubmit={handleFormSubmit}>
                <input type="text" placeholder="Введіть ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Введіть ваше прізвище" value={surname} onChange={(e) => setSurname(e.target.value)} />
                <input type="text" placeholder="Введіть ваш вік" value={age} onChange={(e) => setAge(e.target.value)} />
                <button type="submit">Зберегти</button>
            </form>
        </div>
    );
};
export {RecordAuth};