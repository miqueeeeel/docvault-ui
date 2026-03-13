export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
