import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import s from './Navigation.module.css';
import NavLeft from './Parts/NavLeft';
import NavItem from './NavItem';
import NavRight from './Parts/NavRight';
import { route } from '../../constants';
import NavMiddle from './Parts/NavMiddle';
import NavLogo from './NavLogo';
import { LoadingOutlined} from '@ant-design/icons';
import UserItem from './UserItem';
import { useAuthContext } from '../../hooks/useAuthContext';
import CartItem from './CartItem';

const Navigation = ({ children }) => {
    const [scrolled, isScrolled] = useState(false);
    const location = useLocation();
    const { user, loading } = useAuthContext();

    useEffect(() => {
        const handleScroll = () => {
            isScrolled(window.scrollY > 0);
        }

        window.addEventListener("scroll", handleScroll);
        
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`${s.navbarContainer} ${scrolled ? s.scrolled : ''}`}>
            <nav className={s.navbar}>
                <NavLeft>
                    <NavItem toUrl={route.HOME} text="Home" />
                    <NavItem toUrl={route.SHOP} text="Shop" />
                </NavLeft>
                <NavMiddle>
                    <NavLogo />
                </NavMiddle>
                <NavRight>
                    {/* <NavItem toUrl={route.HOME} text={<HeartOutlined style={{ fontSize: 24 }} />} /> */}
                    {loading ? (
                        <NavItem text={<LoadingOutlined style={{ fontSize: 24 }} />} />
                    ) : user ? (
                        <>
                            <CartItem />
                            <UserItem />
                        </>
                    ) : (
                        <>
                            {location.pathname !== route.SIGN_UP && (
                                <NavItem toUrl={route.SIGN_UP} text="Sign up" />
                            )}
                            {location.pathname !== route.SIGN_IN && (
                                <NavItem toUrl={route.SIGN_IN} text="Sign in" />
                            )}
                        </>
                    )}
                </NavRight>
            </nav>
        </div>
    );
}

export default Navigation;