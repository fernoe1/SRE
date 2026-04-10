import { useState } from "react";
import s from './Dropdown.module.css';
import { DownOutlined } from "@ant-design/icons";

const Dropdown = ({ value, setValue, options, placeholder }) => {   
    const [open, setOpen] = useState(false);

    return (
        <div className={`${s.dropdown} ${open ? s.open : s.closed}`}>
            <input 
                className={s.dropdownInput}
                type="text"
                readOnly
                value={value}
                placeholder={placeholder}
                onClick={() => setOpen(!open)}
            />
            <DownOutlined 
                className={s.inputArrow}
            />
            <ul className={s.dropdownMenu}>
                {options.map((option, i) => (
                    <li key={i} onClick={() => {setValue(option); setOpen(!open); }}>
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dropdown;