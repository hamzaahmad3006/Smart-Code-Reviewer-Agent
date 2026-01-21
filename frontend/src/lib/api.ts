import { ReviewResult, GenerationResult, ChatMessage, ChatResponse } from '../type';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeader = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export async function signIn(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username: email.split('@')[0] })
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
}

export async function signUp(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Signup failed');
    }
    return response.json();
}

export async function reviewCode(code: string, language: string): Promise<ReviewResult> {
    const response = await fetch(`${API_URL}/api/review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
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
    language: string,
    session_id?: string
): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify({
            code,
            review_context: reviewContext,
            messages,
            language,
            session_id
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get chat response');
    }

    return response.json();
}

export async function getSessions() {
    const response = await fetch(`${API_URL}/api/sessions`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
}

export async function getSessionDetail(id: string) {
    const response = await fetch(`${API_URL}/api/sessions/${id}`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch session details');
    return response.json();
}

export async function deleteSession(id: string) {
    const response = await fetch(`${API_URL}/api/sessions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete session');
    return response.json();
}

export async function getProfile() {
    const response = await fetch(`${API_URL}/api/users/me`, {
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
}

export async function updateProfile(data: { full_name?: string; avatar_url?: string; username?: string }) {
    const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
}

export async function uploadToCloudinary(file: File): Promise<string> {
    // Step 1: Get signed parameters from backend
    const signResponse = await fetch(`${API_URL}/api/users/cloudinary/signature`, {
        headers: getAuthHeader()
    });

    if (!signResponse.ok) throw new Error('Failed to get upload signature');
    const signData = await signResponse.json();

    // Step 2: Upload to Cloudinary with signed parameters
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signData.api_key);
    formData.append('timestamp', signData.timestamp.toString());
    formData.append('signature', signData.signature);
    formData.append('folder', signData.folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${signData.cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Cloudinary upload failed');
    const data = await response.json();
    return data.secure_url;
}
