import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import s from './UserItem.module.css';
import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';

const UserItem = ({ text }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const logout = useLogout();

    return (
        <ul 
            className={`${s.userItem} ${open ? s.open : s.closed}`}
            onClick={() => setOpen(!open)}
        >
            <UserOutlined className={s.userItemIcon} />

            <ul className={s.userItemMenu}>
                <li 
                    className={s.userItemMenuItem}
                    onClick={() => navigate("/account")}
                >
                    <p className={s.userItemMenuItemLink}>
                        View account 
                    </p>
                </li>
                <li 
                    className={s.userItemMenuItem}
                    onClick={logout}
                >
                    Sign out <LogoutOutlined 
                        className={s.userItemMenuItemIcon}
                    />
                </li>
            </ul>
        </ul>
    );
}

export default UserItem;