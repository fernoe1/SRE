import s from './NavLeft.module.css'

const NavLeft = ({ children }) => {
    return (
        <div className={s.navbarLeft}>
            { children }
        </div>
    );
}

export default NavLeft;