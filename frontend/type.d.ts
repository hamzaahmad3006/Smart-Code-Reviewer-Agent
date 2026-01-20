export interface ReviewResult {
    score: number;
    issues: string[];
    suggestions: string[];
    reasoning: string;
    language: string;
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
    code: string;
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
}

export interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export interface FileUploadProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}
