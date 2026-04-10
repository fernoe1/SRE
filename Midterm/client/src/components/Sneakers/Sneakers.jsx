import SneakerCard from './SneakerCard';

import s from './Sneakers.module.css';

const Sneakers = ({ sneakers }) => {
    return (
        <div className={s.sneakers}>
            {sneakers.map(sneaker => (
                <SneakerCard key={sneaker.id} sneaker={sneaker} />
            ))}
        </div>
    );
}

export default Sneakers;