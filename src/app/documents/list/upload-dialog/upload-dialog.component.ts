import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DocumentService } from '../../../services/document.service';

@Component({
    selector: 'app-upload-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatChipsModule,
    ],
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialogComponent {
    form: FormGroup;
    loading = signal(false);
    error = signal('');
    selectedFile = signal<File | null>(null);
    tags = signal<string[]>([]);
    separatorKeysCodes = [ENTER, COMMA];

    categories = ['Contrato', 'Factura', 'Informe', 'Presentación', 'Otro'];

    constructor(
        private fb: FormBuilder,
        private documentService: DocumentService,
        private dialogRef: MatDialogRef<UploadDialogComponent>,
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: [''],
            category: [''],
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.selectedFile.set(input.files[0]);
        }
    }

    addTag(event: MatChipInputEvent) {
        const value = (event.value ?? '').trim();
        if (value) this.tags.update(t => [...t, value]);
        event.chipInput.clear();
    }

    removeTag(tag: string) {
        this.tags.update(t => t.filter(x => x !== tag));
    }

    submit() {
        if (this.form.invalid || !this.selectedFile() || this.loading()) return;
        this.loading.set(true);
        this.error.set('');

        const formData = new FormData();
        formData.append('file', this.selectedFile()!);
        formData.append('title', this.form.value.title);
        if (this.form.value.description) formData.append('description', this.form.value.description);
        if (this.form.value.category) formData.append('category', this.form.value.category);
        this.tags().forEach(t => formData.append('tags', t));

        this.documentService.uploadDocument(formData).subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => {
                this.error.set(err.error?.message ?? 'Error al subir el archivo');
                this.loading.set(false);
            },
        });
    }

    cancel() {
        this.dialogRef.close(false);
    }
}
