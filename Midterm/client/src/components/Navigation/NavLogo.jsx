import { cjactLogo } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import s from './NavLogo.module.css';

const NavLogo = () => {
    const navigate = useNavigate();

    return (
        <div className={s.navlogoContainer}>
            <img 
                src={cjactLogo} 
                className={s.navlogoImage} 
                alt="logo" 
                onClick={() => navigate("/")}
            />
        </div>
    );
}

export default NavLogo;