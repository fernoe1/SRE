import s from './NavMiddle.module.css'

const NavMiddle = ({ children }) => {
    return (
        <div className={s.navbarMiddle}>
            { children }
        </div>
    );
}

export default NavMiddle;