import { useEffect, useState } from 'react';
import { getSessions } from '../lib/api';

export function useDashboard() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const fetchSessions = async () => {
            try {
                const data = await getSessions();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessions();
    }, [isMounted]);

    return {
        sessions,
        isLoading,
        isMounted
    };
}
