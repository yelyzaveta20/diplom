import {Login} from "../components/FormContainer/Loginations/Login";
import {supabase} from "../constans/dT";
import {useEffect, useState} from "react";



const LoginPage = () => {
    const [fetchError, setFetchError] = useState(null)
    const [smoothies, setSmoothies] = useState(null)

    useEffect(() => {
        const fetchSmoothies = async () => {
            const { data, error } = await supabase
                .from('recipes')
                .select()

            if (error) {
                setFetchError("Could not fetch the smoothies")
                setSmoothies(null)
            }
            if (data) {
                setSmoothies(data)
                setFetchError(null)
            }
        }

        fetchSmoothies()

    }, [])
    return (
        <div>
            <Login/>
        </div>
    );
};

export {LoginPage};