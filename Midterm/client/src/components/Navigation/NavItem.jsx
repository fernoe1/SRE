import { NavLink } from "react-router-dom";
import s from './NavItem.module.css';

const NavItem = ({ toUrl, text }) => {
    return (
        <ul className={s.navitem}>
            <NavLink className={s.navitemLink} to={toUrl}>
                {text}
            </NavLink>
        </ul>
    );
}

export default NavItem;