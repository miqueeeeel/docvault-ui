import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrido un error inesperado';

            if (error.status === 401) {
                errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
                authService.logout();
            } else if (error.status === 403) {
                errorMessage = 'No tienes permisos para realizar esta acción.';
            } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
            }

            snackBar.open(errorMessage, 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar']
            });

            return throwError(() => error);
        })
    );
};
