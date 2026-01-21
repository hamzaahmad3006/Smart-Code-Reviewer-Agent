import { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '../lib/api';

export function useDashboard() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    useEffect(() => {
        if (!isMounted) return;
        fetchSessions();
    }, [isMounted]);

    const handleDeleteSession = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;

        try {
            await deleteSession(id);
            setSessions(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete session:', error);
            alert('Failed to delete session');
        }
    };

    return {
        sessions,
        isLoading,
        isMounted,
        handleDeleteSession
    };
}
