import { ReviewResult, GenerationResult, ChatMessage, ChatResponse } from '@/type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function reviewCode(code: string, language: string): Promise<ReviewResult> {
    const response = await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to review code');
    }

    return response.json();
}

export async function reviewFile(file: File): Promise<ReviewResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/review/file`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to analyze file');
    }

    return response.json();
}

export async function generateCode(prompt: string, language: string): Promise<GenerationResult> {
    const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, language }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate code');
    }

    return response.json();
}

export async function chatWithAI(
    code: string,
    reviewContext: string,
    messages: ChatMessage[],
    language: string
): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code,
            review_context: reviewContext,
            messages,
            language
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get chat response');
    }

    return response.json();
}
