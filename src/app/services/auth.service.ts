import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUser = signal<User | null>(null);

    user = this.currentUser.asReadonly();
    isLoggedIn = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'admin');

    constructor(private http: HttpClient, private router: Router) {
        this.loadUser();
    }

    register(data: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => this.handleAuth(response))
        );
    }

    login(credentials: any): Observable<AuthResponse> {
        // Mock login for UI exploration
        if (credentials.email === 'admin@docvault.com' && credentials.password === 'admin') {
            const mockResponse: AuthResponse = {
                access_token: 'mock-jwt-token',
                user: {
                    id: 'mock-admin-id',
                    name: 'Admin User',
                    email: 'admin@docvault.com',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            };
            this.handleAuth(mockResponse);
            return of(mockResponse);
        }

        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => this.handleAuth(response))
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    private handleAuth(response: AuthResponse) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
        this.router.navigate(['/documents']);
    }

    private loadUser() {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                this.currentUser.set(JSON.parse(userJson));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
    }
}
