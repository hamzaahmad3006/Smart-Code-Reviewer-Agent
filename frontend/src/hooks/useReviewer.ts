import React, { useState, useEffect } from 'react';
import { reviewCode } from '../lib/api';
import { ReviewResult } from '../type';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useRouter } from 'next/navigation';

export function useReviewer() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [result, setResult] = useState<ReviewResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !isAuthenticated) {
        }
    }, [isAuthenticated, router, isMounted]);

    const handleReview = async () => {
        if (!code.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const reviewResult = await reviewCode(code, language);
            setResult(reviewResult);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to analyze code');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        code,
        setCode,
        language,
        setLanguage,
        result,
        isLoading,
        error,
        isMounted,
        handleReview
    };
}
