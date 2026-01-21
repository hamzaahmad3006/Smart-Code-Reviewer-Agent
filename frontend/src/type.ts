export interface ReviewResult {
    score: number;
    issues: string[];
    suggestions: string[];
    reasoning: string;
    language: string;
    session_id?: string;
}

export interface GenerationResult {
    code: string;
    explanation: string;
    language: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    content: string;
}

export interface CodeInputProps {
    value: string;
    language: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export interface SessionHistoryProps {
    onSelectReview: (review: ReviewResult) => void;
    currentReview: ReviewResult | null;
}

export interface StoredReview extends ReviewResult {
    id: string;
    timestamp: number;
}

export interface ReviewOutputProps {
    result: ReviewResult;
    codeToDisplay?: string;
    codeContext?: string; // Code passed to chat API without displaying
    initialMessages?: ChatMessage[];
}

export interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export interface FileUploadProps {
    onFileSelect: (code: string, language: string) => void;
    disabled?: boolean;
}

export const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'json', name: 'JSON' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
];
