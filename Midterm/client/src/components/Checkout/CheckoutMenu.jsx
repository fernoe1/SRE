import CheckoutLeft from "./CheckoutLeft";
import CheckoutRight from "./CheckoutRight";
import s from "./CheckoutMenu.module.css";

const CheckoutMenu = () => {
  return (
    <div className={s.checkout}>
      <CheckoutLeft />
      <CheckoutRight />
    </div>
  );
};

export default CheckoutMenu;
