import { createContext, useReducer, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {user: action.payload};
        case 'LOGOUT':
            return {user: null};
        case 'UPDATE':
            return {
                user: {
                    ...state.user,
                    ...action.payload
                }
            }
        default: 
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setLoading(false); 
                return;
            }

            try {
                const { _id } = jwtDecode(token);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${_id}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) {
                    dispatch({ type: "LOGOUT" });
                    localStorage.removeItem("token");
                } else {
                    const user = await response.json();
                    dispatch({ type: "LOGIN", payload: user });
                }
            } catch (err) {
                dispatch({ type: "LOGOUT" });
                localStorage.removeItem("token");
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false); 
        };

        fetchData();
    }, [dispatch]);

    console.log('AuthContext state:', state);

    return (
        <AuthContext.Provider value={{...state, dispatch, loading}}>
            { children }
        </AuthContext.Provider>
    );
}