import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import s from './SneakerDetails.module.css';
import Dropdown from './Dropdown';
import { HeartFilled, HeartOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useBasketContext } from '../../hooks/useBasketContext';
import { useBasket } from '../../hooks/useBasket';

const SneakerDetails = () => {
    const { user } = useAuthContext();
    const { basket } = useBasketContext();
    const { addItem, removeItem } = useBasket();

    const [sneaker, setSneaker] = useState(null);
    const [size, setSize] = useState(null);
    const { id } = useParams();
    const [sizeError, setSizeError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();

    const [wishHovered, setWishHovered] = useState(false);

    const inBag = basket.some(
        item => item.sneaker._id === id && item.size === size
    );

    useEffect(() => {
        const fetchSneaker = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/sneakers/${id}`);
                const json = await response.json();

                if (!response.ok) {
                    console.error(json.error);
                } else {
                    setSneaker(json.sneaker);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSneaker();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        if (!size) {
            setSizeError(true);
            return;
        }

        try {
            setLoading(true);

            if (inBag) {
                await removeItem(id, size);
            } else {
                await addItem(
                    id,
                    size,
                    parseFloat(sneaker.price.$numberDecimal)
                );
            }

            setSizeError(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.sneakerDetailsContainer}>
            <div className={s.sneakerContainerTwoFr}>
                <div className={s.sneakerBigImgContainer}>
                    <div className={s.sneakerBigImgs}>
                        <img src={sneaker?.images?.[0]} />
                    </div>
                    <div className={s.sneakerBigImgs}>
                        <img src={sneaker?.images?.[2]} />
                    </div>
                </div>
                <div className={s.sneakerSmallImgContainer}>
                    <div className={s.sneakerSmallImgs}>
                        <img src={sneaker?.images?.[1]} />
                    </div>
                    <div className={s.sneakerSmallImgs}>
                        <img src={sneaker?.images?.[3]} />
                    </div>
                    <div className={s.sneakerSmallImgs}>
                        <img src={sneaker?.images?.[4]} />
                    </div>
                </div>
            </div>

            <div className={s.sneakerContainerOneFr}>
                <div className={s.sneakerDesc}>
                    <p className={s.sneakerBrand}>{sneaker?.brand}</p>
                    <p className={s.sneakerName}>{sneaker?.name}</p>

                    {sizeError && (
                        <p className={s.sneakerSizeError}>
                            Please select size
                        </p>
                    )}

                    <Dropdown
                        value={size}
                        setValue={setSize}
                        options={[36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]}
                        placeholder={'Select size'}
                    />

                    <div className={s.bagOrWishlist}>
                        <div
                            className={`${inBag ? s.inBag : s.bag}`}
                            onClick={handleAddToCart}
                        >
                            {loading ? (
                                <LoadingOutlined />
                            ) : inBag ? (
                                <p>Remove from Cart</p>
                            ) : (
                                <p>Add to Cart</p>
                            )}
                        </div>
                    </div>

                    {sneaker?.price && (
                        <p className={s.sneakerPrice}>
                            ${parseFloat(sneaker.price.$numberDecimal)}
                        </p>
                    )}
                </div>
            </div>

            {showAuthModal && (
                <div
                    className={s.modalOverlay}
                    onClick={() => setShowAuthModal(false)}
                >
                    <div
                        className={s.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>You’re not signed in</h3>
                        <p>
                            Please sign in or create an account to add items to
                            your cart.
                        </p>

                        <div className={s.modalActions}>
                            <button onClick={() => navigate("/signin")}>
                                Sign In
                            </button>

                            <button onClick={() => navigate("/signup")}>
                                Sign Up
                            </button>

                            <button onClick={() => setShowAuthModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SneakerDetails;
