import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { signUp as apiSignUp } from '../lib/api';

export const useSignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await apiSignUp(username, email, password);
            dispatch(setCredentials({ token: data.access_token }));
            router.push('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        error,
        handleSignUp
    };
};
