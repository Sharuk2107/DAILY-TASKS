const API_URL = 'http://localhost:3000/api';

export interface User {
    id?: string;
    username: string;
    created_at?: string;
}

export interface Task {
    id: string;
    userId?: string;
    text: string;
    completed: boolean;
    create_at?: string; // DB returns snake_case
    createdAt?: string; // Frontend uses camelCase
    completed_at?: string;
}

export interface StreakData {
    currentStreak: number;
    lastCompletedDate: string | null;
    completedDates: string[];
}

export const loginUser = async (username: string): Promise<User> => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export const fetchCurrentTask = async (userId: string): Promise<Task | null> => {
    const res = await fetch(`${API_URL}/task/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
};

export const createTask = async (userId: string, text: string): Promise<Task> => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const createdAt = new Date().toISOString();

    const res = await fetch(`${API_URL}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text, id, createdAt }),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
};

export const completeTask = async (taskId: string, userId: string): Promise<void> => {
    const completedAt = new Date().toISOString();
    const res = await fetch(`${API_URL}/task/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, userId, completedAt }),
    });
    if (!res.ok) throw new Error('Failed to complete task');
};

export const fetchStreakData = async (userId: string): Promise<StreakData> => {
    const res = await fetch(`${API_URL}/streak/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch streak');
    return res.json();
};
