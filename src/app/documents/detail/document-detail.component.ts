import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { Version } from '../../models/version.model';
import { EditDocumentDialogComponent } from './edit-document-dialog/edit-document-dialog.component';

@Component({
    selector: 'app-document-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './document-detail.component.html',
    styleUrls: ['./document-detail.component.scss'],
})
export class DocumentDetailComponent implements OnInit {
    document = signal<Document | null>(null);
    versions = signal<Version[]>([]);
    loading = signal(true);
    uploadingVersion = signal(false);
    versionColumns = ['versionNumber', 'uploadedAt', 'actions'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private documentService: DocumentService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.loadDocument(id);
        this.loadVersions(id);
    }

    loadDocument(id: string) {
        this.loading.set(true);
        this.documentService.getDocument(id).subscribe({
            next: (doc) => { this.document.set(doc); this.loading.set(false); },
            error: () => { this.loading.set(false); this.router.navigate(['/documents']); },
        });
    }

    loadVersions(id: string) {
        this.documentService.getVersions(id).subscribe({
            next: (v) => this.versions.set(v),
        });
    }

    goBack() { this.router.navigate(['/documents']); }

    downloadCurrent() {
        if (this.document()) this.documentService.downloadDocument(this.document()!.id);
    }

    downloadVersion(versionId: string) {
        this.documentService.downloadVersion(versionId);
    }

    onVersionFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file || !this.document()) return;

        this.uploadingVersion.set(true);
        const formData = new FormData();
        formData.append('file', file);

        this.documentService.uploadVersion(this.document()!.id, formData).subscribe({
            next: () => {
                this.snackBar.open('Nueva versión subida', 'OK', { duration: 3000 });
                this.loadDocument(this.document()!.id);
                this.loadVersions(this.document()!.id);
                this.uploadingVersion.set(false);
            },
            error: () => {
                this.snackBar.open('Error al subir versión', 'Cerrar', { duration: 3000 });
                this.uploadingVersion.set(false);
            },
        });

        input.value = '';
    }

    openEditDialog() {
        const ref = this.dialog.open(EditDocumentDialogComponent, {
            width: '460px',
            data: this.document(),
        });
        ref.afterClosed().subscribe(result => {
            if (result) {
                this.snackBar.open('Documento actualizado', 'OK', { duration: 3000 });
                this.loadDocument(this.document()!.id);
            }
        });
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
}
