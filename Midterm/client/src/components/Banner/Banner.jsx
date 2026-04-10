import s from './Banner.module.css';

import { cjactBanner } from '../../assets/images';

const Banner = () => {
    return (
        <div className={s.bannerContainer}>
            <div className={s.bannerTextContainer}>
                <span className={s.bannerTextHeadline}>Jact</span>
                <span className={s.bannerText}>A demo showcase for Travis Scott–collaborated sneakers, built with React and Express.</span>
            </div>
            <div className={s.bannerImageContainer}>
                {/* <img className={s.bannerImage} src={cjactBanner} alt="Banner"/> */}
            </div>
        </div>
    );
}

export default Banner;