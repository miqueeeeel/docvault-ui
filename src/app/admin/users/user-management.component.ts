import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
    users = signal<User[]>([]);
    loading = signal(true);
    displayedColumns = ['avatar', 'name', 'email', 'role', 'createdAt', 'actions'];

    constructor(
        private documentService: DocumentService,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading.set(true);
        this.documentService.getUsers().subscribe({
            next: (users) => { this.users.set(users); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    updateRole(user: User, role: string) {
        this.documentService.updateUserRole(user.id, role).subscribe({
            next: () => {
                this.snackBar.open(`Rol de ${user.name} actualizado`, 'OK', { duration: 3000 });
                this.loadUsers();
            },
            error: () => this.snackBar.open('Error al actualizar rol', 'Cerrar', { duration: 3000 }),
        });
    }

    getInitials(name: string): string {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}
