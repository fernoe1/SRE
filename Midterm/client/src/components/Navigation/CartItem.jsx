import { ShoppingCartOutlined, PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import s from "./CartItem.module.css";
import { useNavigate } from "react-router-dom";
import { useBasketContext } from "../../hooks/useBasketContext";
import { useBasket } from "../../hooks/useBasket";

const CartItem = () => {
    const [open, setOpen] = useState(false);
    const cartRef = useRef(null);
    const navigate = useNavigate();

    const { basket: items } = useBasketContext();
    const { fetchBasket, updateQty, removeItem } = useBasket();

    const handleIncrease = async (item) => {
        await updateQty(item.sneaker._id, item.size, 1);
    };

    const handleDecrease = async (item) => {
        if (item.quantity === 1) return;
        await updateQty(item.sneaker._id, item.size, -1);
    };

    const handleRemove = async (item) => {
        await removeItem(item.sneaker._id, item.size);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (cartRef.current && !cartRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.body.style.overflow = open ? "hidden" : "auto";

        if (open) {
            fetchBasket();
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.price.$numberDecimal) * item.quantity,
        0
    );

    const handleCheckout = () => {
        navigate("/checkout");
        setOpen(false);
    };

    return (
        <>
            <div className={s.cartItem} onClick={() => setOpen(true)}>
                <ShoppingCartOutlined className={s.shoppingCart} />
                {items.length > 0 && (
                    <p className={s.cartItemNumber}>{items.length}</p>
                )}
            </div>

            <div ref={cartRef} className={`${s.cart} ${open ? s.open : ""}`}>
                <div className={s.cartHeader}>
                    <h3>My Basket ({items.length} items)</h3>
                    <button
                        className={s.closeButton}
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                </div>

                <div className={s.cartContent}>
                    {items.map((item) => (
                        <div
                            key={`${item.sneaker._id}-${item.size}`}
                            className={s.cartRow}
                        >
                            <div className={s.qtyControls}>
                                <button
                                    className={s.qtyButton}
                                    onClick={() => handleIncrease(item)}
                                >
                                    <PlusOutlined />
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    className={`${s.qtyButton} ${
                                        item.quantity === 1 ? s.qtyDisabled : ""
                                    }`}
                                    onClick={() => handleDecrease(item)}
                                    disabled={item.quantity === 1}
                                >
                                    <MinusOutlined />
                                </button>
                            </div>

                            <img
                                src={item.sneaker.firstImage}
                                alt={item.sneaker.name}
                                className={s.cartImage}
                            />

                            <div className={s.cartInfo}>
                                <p className={s.cartName}>
                                    {item.sneaker.name}
                                </p>
                                <b>Size {item.size}</b>
                            </div>

                            <div className={s.cartPrice}>
                                ${Number(item.price.$numberDecimal).toFixed(2)}
                            </div>

                            <button
                                className={s.removeButton}
                                onClick={() => handleRemove(item)}
                            >
                                <CloseOutlined />
                            </button>
                        </div>
                    ))}
                </div>

                <div className={s.cartFooter}>
                    <div className={s.subtotal}>
                        <span>Subtotal Amount: </span>
                        <strong>${subtotal.toFixed(2)}</strong>
                    </div>

                    <button
                        className={s.checkout}
                        onClick={handleCheckout}
                    >
                        CHECK OUT
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartItem;
