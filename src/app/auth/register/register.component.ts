import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    form: FormGroup;
    loading = signal(false);
    error = signal('');
    hidePassword = signal(true);

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit() {
        if (this.form.invalid || this.loading()) return;
        this.error.set('');
        this.loading.set(true);

        const data = this.form.value;
        this.authService.register(data).subscribe({
            next: () => this.router.navigate(['/documents']),
            error: (err) => {
                this.error.set(err.error?.message ?? 'Error al registrarse');
                this.loading.set(false);
            },
        });
    }
}
