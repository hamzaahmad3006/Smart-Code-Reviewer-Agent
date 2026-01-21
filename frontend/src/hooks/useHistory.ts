import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSessionDetail } from '../lib/api';
import { StoredReview } from '../type';

export function useHistory() {
    const router = useRouter();
    const { id } = router.query;
    const [session, setSession] = useState<StoredReview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !id) return;

        const fetchSession = async () => {
            try {
                const data = await getSessionDetail(id as string);
                setSession(data);
            } catch (error: unknown) {
                console.error('Failed to fetch session:', error);
                // Optionally set an error state if you want to show it in the UI
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [id, isMounted]);

    useEffect(() => {
        if (session) {
            console.log('Session Data Fetched:', session);
        }
    }, [session]);

    return { session, isLoading, isMounted, id };
}
