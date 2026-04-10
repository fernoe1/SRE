import s from './BufferShop.module.css';
import { Link } from 'react-router-dom';

const BufferShop = () => {
    return (
        <div className={s.bufferContainer}>
            <div className={s.buffer}>
                <div className={s.bufferLeft}>
                    <p className={s.msg}>Our Products</p>
                </div>
                <div className={s.bufferRight}>
                    <Link className={s.link} to="/shop">See All</Link>
                </div>
            </div>
        </div>
    );
}

export default BufferShop;