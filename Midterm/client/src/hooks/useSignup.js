import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { jwtDecode } from "jwt-decode";

export const useSignup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async ( name, email, password ) => {
        setIsSubmitting(true);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json()

        if (!response.ok) {
            setIsSubmitting(false);
            setAuthError(json.error);

            return false;
        }

        if (response.ok) {
            localStorage.setItem('token', json.token);

            const { _id } = jwtDecode(json.token);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${_id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${json.token}` }
            }); 

            const user = await response.json();    
            dispatch({type: "LOGIN", payload: user})
            setIsSubmitting(false);

            return true;
        }
    }

    return { signup, isSubmitting, authError, setAuthError }
}