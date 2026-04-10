import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import s from './VerificationDetails.module.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { LoadingOutlined } from '@ant-design/icons';

const VerificationDetails = () => {
    const [params] = useSearchParams();
    const { dispatch } = useAuthContext();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = async () => {
            try {
                const mailToken = params.get("token");

                if (!mailToken) {
                    setMessage("Invalid or missing verification token.");
                    return;
                }

                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/users/verify?token=${mailToken}`
                );
                const json = await response.json();

                if (!response.ok) {
                    setMessage(json.error);
                    return;
                }

                dispatch({ type: 'UPDATE', payload: { isVerified: true } });
                setMessage(json.message);
            } catch (err) {
                console.error(err);
                setMessage("Verification failed. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        auth();
    }, [params, dispatch]);

    return (
        <div className={s.verificationDetails}>
            {loading ? (
                <LoadingOutlined />
            ) : (
                <>
                    <p className={s.verificationDetailsMessage}>{message}</p>
                    <p className={s.verificationDetailsUnder}>
                        You may close this window
                    </p>
                </>
            )}
        </div>
    );
};


export default VerificationDetails;