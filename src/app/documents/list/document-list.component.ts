import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';

@Component({
    selector: 'app-document-list',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatCardModule,
    ],
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
    documents = signal<Document[]>([]);
    loading = signal(false);
    totalDocuments = signal(0);
    currentPage = signal(0);
    pageSize = signal(10);

    searchControl = new FormControl('');
    categoryControl = new FormControl('');
    sortControl = new FormControl('-createdAt');

    displayedColumns = ['title', 'category', 'tags', 'version', 'createdAt', 'actions'];

    categories = ['Contrato', 'Factura', 'Informe', 'Presentación', 'Otro'];

    constructor(
        private documentService: DocumentService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router,
    ) { }

    ngOnInit() {
        this.loadDocuments();

        this.searchControl.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => {
            this.currentPage.set(0);
            this.loadDocuments();
        });

        this.categoryControl.valueChanges.subscribe(() => {
            this.currentPage.set(0);
            this.loadDocuments();
        });

        this.sortControl.valueChanges.subscribe(() => this.loadDocuments());
    }

    loadDocuments() {
        this.loading.set(true);
        this.documentService.getDocuments({
            search: this.searchControl.value ?? undefined,
            category: this.categoryControl.value ?? undefined,
            sort: this.sortControl.value ?? undefined,
            page: this.currentPage() + 1,
            limit: this.pageSize(),
        }).subscribe({
            next: (res) => {
                this.documents.set(res.data);
                this.totalDocuments.set(res.total);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    onPageChange(event: PageEvent) {
        this.currentPage.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadDocuments();
    }

    openDocument(doc: Document) {
        this.router.navigate(['/documents', doc.id]);
    }

    openUploadDialog() {
        const ref = this.dialog.open(UploadDialogComponent, {
            width: '500px',
            disableClose: true,
        });
        ref.afterClosed().subscribe(result => {
            if (result) {
                this.snackBar.open('Documento subido correctamente', 'OK', { duration: 3000 });
                this.loadDocuments();
            }
        });
    }

    deleteDocument(doc: Document, event: Event) {
        event.stopPropagation();
        if (!confirm(`¿Eliminar "${doc.title}"?`)) return;
        this.documentService.deleteDocument(doc.id).subscribe({
            next: () => {
                this.snackBar.open('Documento eliminado', 'OK', { duration: 3000 });
                this.loadDocuments();
            },
            error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 }),
        });
    }

    downloadDocument(doc: Document, event: Event) {
        event.stopPropagation();
        this.documentService.downloadDocument(doc.id);
    }

    clearFilters() {
        this.searchControl.setValue('');
        this.categoryControl.setValue('');
        this.sortControl.setValue('-createdAt');
        this.currentPage.set(0);
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}
