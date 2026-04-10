import s from './NavRight.module.css'

const NavRight = ({ children }) => {
    return (
        <div className={s.navbarRight}>
            { children }
        </div>
    );
}

export default NavRight;