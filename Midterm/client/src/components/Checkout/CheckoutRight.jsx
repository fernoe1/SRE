import s from "./CheckoutRight.module.css";

const CheckoutRight = () => {
  return (
    <div className={s.right}>
      <h2>Payment</h2>

      <form className={s.form}>
        <input placeholder="Cardholder Name" />
        <input placeholder="Card Number" />
        <input placeholder="MM / YY" />
        <input placeholder="CVC" />

        <button type="button">Place Order</button>
      </form>
    </div>
  );
};

export default CheckoutRight;
