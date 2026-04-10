import { useFavoriteContext } from "./useFavoriteContext"

export const useFavorite = () => {
    const { dispatch } = useFavoriteContext();

    const addFavorite = async (sneaker) => {
        dispatch({
            type: 'ADD',
            payload: sneaker
        });
    };

    const removeFavorite = async (sneaker) => {
        dispatch({
            type: 'REMOVE',
            payload: sneaker
        });
    };

    const clearFavorite = async () => {
        dispatch({type: 'CLEAR'});
    };

    return { addFavorite, removeFavorite, clearFavorite };
}