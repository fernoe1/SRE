import { useContext } from "react"
import { FavoriteContext } from "../context/FavoriteContext"

export const useFavoriteContext = () => {
    const context = useContext(FavoriteContext);

    if (!context) {
        throw Error("useFavoriteContext should be used inside FavoriteContext scope");
    }

    return context;
}