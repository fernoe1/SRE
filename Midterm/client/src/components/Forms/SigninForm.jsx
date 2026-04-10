import { useState, useEffect } from "react";
import s from './SigninForm.module.css';
import { useSignin } from "../../hooks/useSignin";
import { NavLink, useNavigate } from "react-router-dom";
import { route } from "../../constants";

const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email is not valid";

    return null;
}

const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    
    return null;
}

const SigninForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: null,
        password: null
    });

    const [touched, isTouched] = useState({
        email: false,
        password: false
    });

    const { signin, isSubmitting, authError, setAuthError } = useSignin();

    const navigate = useNavigate();

    useEffect(() => {
        const newErrors = { ...errors };

        if (touched.email || formData.email !== '') newErrors.email = validateEmail(formData.email);
        if (touched.password || formData.password !== '') newErrors.password = validatePassword(formData.password);
        
        setErrors(newErrors);
    }, [formData, touched]);

    const inputOnChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    }

    const inputOnBlur = (e) => {
        const { id } = e.target;
        isTouched((prev) => ({
            ...prev,
            [id]: true
        }));
    }

    const handleOnSubmit = async(e) => {
        e.preventDefault();
        if (authError != null) {
            setAuthError(null);
        }
        
        if (!errors.email && !errors.password) {
            const flag = await signin(formData.email, formData.password);
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
                    className={`${s.formLabel} ${errors.email ? s.formLabelError : ''}`}
                    htmlFor="email"
                >
                    {errors.email ? errors.email : "* Email"}
                </label>
                <input
                    className={`${s.formInput} ${errors.email ? s.formInputError : ''}`}
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => inputOnChange(e)}
                    onBlur={(e) => inputOnBlur(e)}
                />

                <label
                    className={`${s.formLabel} ${errors.password ? s.formLabelError : ''}`}
                    htmlFor="password"
                >
                    {errors.password ? errors.password : "* Password"}
                </label>
                <input
                    className={`${s.formInput} ${errors.password ? s.formInputError : ''}`}
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => inputOnChange(e)}
                    onBlur={(e) => inputOnBlur(e)}
                />

                <button
                    className={s.formSubmit}
                    type="submit"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </div>

            <div className={s.formUnderText}>
                <p>Don't have an account? <NavLink className={s.formUnderTextLink} to={route.SIGN_UP}>Sign up</NavLink></p>
            </div>
        </form>
    );
}

export default SigninForm;