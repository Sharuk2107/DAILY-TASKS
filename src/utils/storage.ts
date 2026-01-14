const STORAGE_KEYS = {
    USER: 'onetask_user', // Keep basic user info for session persistence mainly
};

export interface User {
    id?: string;
    username: string;
    created_at?: string;
    // loginType is now handled by how we derived the user (or removed if not needed)
}

// Minimal local storage for keeping the session active on refresh
// Actual data now comes from API
export const getStoredUser = (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
};

export const saveStoredUser = (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
};

export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
