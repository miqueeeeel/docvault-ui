import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTableModule,
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
    allDocuments = signal<Document[]>([]);
    totalDocs = signal(0);
    totalUsers = signal(0);
    loading = signal(true);
    displayedColumns = ['user', 'title', 'category', 'version', 'createdAt'];

    constructor(private documentService: DocumentService) { }

    ngOnInit() {
        this.documentService.getAdminDocuments({ limit: 5, sort: '-createdAt' }).subscribe({
            next: (res) => {
                this.allDocuments.set(res.data);
                this.totalDocs.set(res.total);
                this.loading.set(false);
            },
        });

        this.documentService.getUsers().subscribe({
            next: (users) => this.totalUsers.set(users.length),
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}
