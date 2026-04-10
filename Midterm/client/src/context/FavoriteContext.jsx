import { createContext, useReducer } from "react";

export const FavoriteContext = createContext();

export const favoriteReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            return {
                favorites: [...state.favorites, action.payload]
            };
        case 'REMOVE':
            return {
                favorites: state.favorites.filter(item => item.id !== action.payload.id)
            };
        case 'CLEAR':
            return {
                favorites: []
            };
        default:
            return state;
    }
};

export const FavoriteContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(favoriteReducer, {
        favorites: new Set()
    });

    console.log('FavoriteContext state:', state);

    return (
        <FavoriteContext.Provider value={{...state, dispatch}}>
            { children }
        </FavoriteContext.Provider>
    )
};