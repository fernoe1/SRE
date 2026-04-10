import { useAuthContext } from "../../hooks/useAuthContext";
import s from "./CheckoutLeft.module.css";

const CheckoutLeft = () => {
    const { user } = useAuthContext();

    return (
        <div className={s.left}>
        <h2>Shipping Information</h2>

        <form className={s.form}>
            <input placeholder="Full Name" value={user.name} />
            <input placeholder="Address" value={user.address}/>
            <input placeholder="City" value={user.city}/>
            <input placeholder="State" value={user.state}/>
            <input placeholder="Postal Code" value={user.postalCode}/>
            <input placeholder="Phone Number" value={user.phoneNumber}/>
        </form>
        </div>
    );
};

export default CheckoutLeft;
