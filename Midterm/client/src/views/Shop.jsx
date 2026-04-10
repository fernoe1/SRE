import { useState, useEffect } from "react";
import Sneakers from "../components/Sneakers/Sneakers";


const Shop = () => {
    const [sneakers, setSneakers] = useState([]);

    useEffect(() => {
        const fetchSneakers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/sneakers`);
                const json = await response.json();

                if (!response.ok) {
                    console.error(json.error);
                } else {
                    setSneakers(json.sneakers);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchSneakers();
    }, [])

    return (
        <>
            <Sneakers sneakers={sneakers} />
        </>
    );
}

export default Shop;