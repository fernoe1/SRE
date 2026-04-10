import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './SneakerCard.module.css';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useFavorite } from '../../hooks/useFavorite';

const SneakerCard = ({ sneaker }) => {
    const [imgHovered, setImgHovered] = useState(false);
    const [descHovered, setDescHovered] = useState(false);
    const [wishlistHovered, setWishlistHovered] = useState(false);
    const [favorited, setFavorited] = useState(false);
    
    const { addFavorite, removeFavorite } = useFavorite();
    const handleFavorite = async () => {
        if (!favorited) {
            setFavorited(true);
            addFavorite(sneaker);
        } else {
            setFavorited(false);
            removeFavorite(sneaker);
        }
    }

    const navigate = useNavigate();
    const navClick = () => {
        navigate(`/sneakers/${sneaker._id}`)
    }


    return (
        <div className={s.sneakerContainer}>
            {/* <div 
                    className={s.sneakerWishlistContainer}
                    onMouseEnter={() => setWishlistHovered(true)}
                    onMouseLeave={() => setWishlistHovered(false)}
                    onClick={() => handleFavorite()}
                >
                    <div className={`${s.sneakerWishlist} ${favorited ? s.favorited : ''}`}>
                        {favorited ? <HeartFilled /> : wishlistHovered ? <HeartFilled /> : <HeartOutlined />}
                    </div>
            </div> */}

            <div 
                className={s.sneakerImageContainer}
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={() => setImgHovered(false)}
                onClick={() => navClick()}
            >
                <img 
                    className={`${s.sneakerImage} ${imgHovered ? s.hidden : s.visible}`} 
                    src={sneaker.images[0]}
                    alt={sneaker.name}
                />
                <img
                    className={`${s.sneakerImage} ${imgHovered ? s.visible : s.hidden}`}
                    src={sneaker.images[2]}
                    alt={sneaker.name}
                />
            </div>

            <div 
                className={s.sneakerDescContainer}
                onMouseEnter={() => setDescHovered(true)}
                onMouseLeave={() => setDescHovered(false)}
                onClick={() => navClick()}
            >
                <div className={`${s.sneakerDesc} ${descHovered ? s.hidden : s.visible}`}>
                    <p className={s.sneakerBrand}>{sneaker.brand}</p>
                    <p className={s.sneakerName}>{sneaker.name}</p>
                    <p className={s.sneakerPrice}>${parseFloat(sneaker.price.$numberDecimal)}</p>
                </div>
                <div className={`${s.sneakerDesc} ${descHovered ? s.visible : s.hidden}`}>
                    <p className={s.sneakerAvailable}>Available</p>
                    <p className={s.sneakerAvailableDesc}>View product</p>
                </div>
            </div>
        </div>
    );
}

export default SneakerCard;