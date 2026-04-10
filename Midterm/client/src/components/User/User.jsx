import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { jwtDecode } from "jwt-decode";
import s from "./User.module.css";

const User = () => {
    const { user, dispatch } = useAuthContext(); 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        phoneNumber: user.phoneNumber || "",
    });

    const refetchMail = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded = jwtDecode(token);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${decoded._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) return;

            const data = await res.json();
            const isVerified = data.isVerified;
            if (!isVerified) return;

            dispatch({ type: `UPDATE`, payload: { isVerified } });
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Update failed");

            dispatch({ type: "LOGIN", payload: data.user });

            setIsEditing(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    const verifyUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/sendmail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            const json = await response.json();
            if (!response.ok) throw new Error(json.error);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                refetchMail();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    return (
        <div className={s.userContainer}>
            <div className={s.user}>
                <h1 className={s.userDataName}>{user.name}</h1>
                <p className={s.userDataType}>Email</p>
                <div className={s.userEmailContainer}>
                    <p className={s.userData}>{user.email} <b className={s.userDataEmail}>{user.isVerified ? "(verified)" : "(not verified)"}</b></p>
                    {!user.isVerified && 
                        <p className={s.userVerify} onClick={verifyUser}>Click to verify</p>
                    }
                </div>

                {isEditing ? (
                    <form className={s.userForm} onSubmit={handleSubmit}>
                        <label>
                            Address
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            City
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            State
                            <input
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Postal Code
                            <input
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Phone Number
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </label>

                        <button type="submit" className={s.editButton} onClick={handleSubmit}>
                            Save
                        </button>
                        <button type="button" className={s.editButton} onClick={handleEditToggle}>
                            Cancel
                        </button>
                    </form>
                ) : (
                    <>
                        <p className={s.userDataType}>Address</p>
                        <p className={s.userData}>{user.address || "-"}</p>
                        <p className={s.userDataType}>City</p>
                        <p className={s.userData}>{user.city || "-"}</p>
                        <p className={s.userDataType}>State</p>
                        <p className={s.userData}>{user.state || "-"}</p>
                        <p className={s.userDataType}>Postal Code</p>
                        <p className={s.userData}>{user.postalCode || "-"}</p>
                        <p className={s.userDataType}>Phone Number</p>
                        <p className={s.userData}>{user.phoneNumber || "-"}</p>

                        <button className={s.editButton} onClick={handleEditToggle}>
                            Edit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default User;
