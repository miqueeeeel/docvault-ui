import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./auth/login/login.component').then((m) => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./auth/register/register.component').then(
                        (m) => m.RegisterComponent,
                    ),
            },
        ],
    },
    {
        path: '',
        loadComponent: () =>
            import('./shared/components/layout/layout.component').then(
                (m) => m.LayoutComponent,
            ),
        canActivate: [authGuard],
        children: [
            {
                path: 'documents',
                loadComponent: () =>
                    import('./documents/list/document-list.component').then(
                        (m) => m.DocumentListComponent,
                    ),
            },
            {
                path: 'documents/:id',
                loadComponent: () =>
                    import('./documents/detail/document-detail.component').then(
                        (m) => m.DocumentDetailComponent,
                    ),
            },
            {
                path: 'admin',
                canActivate: [adminGuard],
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () =>
                            import('./admin/dashboard/admin-dashboard.component').then(
                                (m) => m.AdminDashboardComponent,
                            ),
                    },
                    {
                        path: 'users',
                        loadComponent: () =>
                            import('./admin/users/user-management.component').then(
                                (m) => m.UserManagementComponent,
                            ),
                    },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                ],
            },
            { path: '', redirectTo: 'documents', pathMatch: 'full' },
        ],
    },
    { path: '**', redirectTo: 'documents' },
];
