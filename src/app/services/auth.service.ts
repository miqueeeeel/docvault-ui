import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUser = signal<User | null>(null);

    user = this.currentUser.asReadonly();
    isLoggedIn = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'admin');

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage(): void {
        const userData = localStorage.getItem('docvault_user');
        if (userData) {
            this.currentUser.set(JSON.parse(userData));
        }
    }

    register(name: string, email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }).pipe(
            tap((response) => this.handleAuthResponse(response)),
        );
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap((response) => this.handleAuthResponse(response)),
        );
    }

    logout(): void {
        localStorage.removeItem('docvault_token');
        localStorage.removeItem('docvault_user');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('docvault_token');
    }

    private handleAuthResponse(response: AuthResponse): void {
        localStorage.setItem('docvault_token', response.access_token);
        localStorage.setItem('docvault_user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
    }
}
