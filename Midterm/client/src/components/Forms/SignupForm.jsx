import { useState, useEffect } from 'react';
import { useSignup } from '../../hooks/useSignup';
import s from './SignupForm.module.css';
import { route } from '../../constants';
import { NavLink, useNavigate } from 'react-router-dom';

const validateName = (name) => {
    if (!name.trim()) return "Full name is required";
    if (name.length < 4) return "Full name should be at least 4 characters long";
    if (!name.includes(" ")) return "Full name should include first and last name";

    const spaceIndex = name.indexOf(" ");
    if (spaceIndex === name.length - 1) return "Please complete your last name";

    if (/\s{2,}/.test(name)) return "Please remove extra spaces between names";

    return null;
}

const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email is not valid";

    return null;
}

const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 8) return "Password should be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password should have at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password should have at least one number";

    return null;
}

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        name: null,
        email: null,
        password: null
    });

    const [touched, isTouched] = useState({
        name: false,
        email: false,
        password: false
    });

    const { isSubmitting, authError, signup, setAuthError } = useSignup();

    const navigate = useNavigate();

    useEffect(() => {
        const newErrors = { ...errors };

        if (touched.name || formData.name !== '') newErrors.name = validateName(formData.name);
        if (touched.email || formData.email !== '') newErrors.email = validateEmail(formData.email);
        if (touched.password || formData.password !== '') newErrors.password = validatePassword(formData.password);

        setErrors(newErrors);
    }, [formData, touched]);

    const handleOnBlur = (e) => {
        const { id } = e.target;
        isTouched((prev) => ({
            ...prev,
            [id]: true
        }));
    }

    const handeOnChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (authError != null) {
            setAuthError(null);
        }

        isTouched({
            name: true,
            email: true,
            password: true
        });

        if (!errors.name && !errors.email && !errors.password) {
            const flag = await signup(formData.name, formData.email, formData.password);
            if (flag) {
                navigate("/");
            }
        }
    }

    
    return (
        <form className={`${s.form} ${authError ? s.formError : ''}`} onSubmit={(e) => handleOnSubmit(e)} noValidate>
            {authError && (
                <div className={s.formInputErrorToast}>
                    <p>{authError}</p>
                </div>
            )}

            <div className={s.formInputContainer}>
                <label
                    htmlFor="name"
                    className={`${s.formLabel} ${errors.name ? s.formLabelError : ''}`}
                >
                    {errors.name ? errors.name : "* Full name"}
                </label>
                <input
                    className={`${s.formInput} ${errors.name ? s.formInputError : ''}`}
                    type="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handeOnChange(e)}
                    onBlur={(e) => handleOnBlur(e)}
                />

                <label
                    htmlFor="email"
                    className={`${s.formLabel} ${errors.email ? s.formLabelError : ''}`}
                >
                    {errors.email ? errors.email : "* Email"}
                </label>
                <input 
                    className={`${s.formInput} ${errors.email ? s.formInputError : ''}`}
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handeOnChange(e)}
                    onBlur={(e) => handleOnBlur(e)}
                />

                <label
                    htmlFor="password"
                    className={`${s.formLabel} ${errors.password ? s.formLabelError : ''}`}
                >
                    {errors.password ? errors.password : "* Password"}
                </label>
                <input 
                    className={`${s.formInput} ${errors.password ? s.formInputError : ''}`}
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => handeOnChange(e)}
                    onBlur={(e) => handleOnBlur(e)}
                />

                <button
                    className={s.formSubmit}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
            </div>

            <div className={s.formUnderText}>
                <p>Already have an account? <NavLink className={s.formUnderTextLink} to={route.SIGN_IN}>Sign in</NavLink></p>
            </div>
        </form>
    );
}

export default SignupForm