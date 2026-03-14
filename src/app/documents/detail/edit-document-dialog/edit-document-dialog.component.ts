import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';

@Component({
  selector: 'app-edit-document-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './edit-document-dialog.component.html',
  styleUrls: ['./edit-document-dialog.component.scss'],
})
export class EditDocumentDialogComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  categories = ['Contrato', 'Factura', 'Informe', 'Presentación', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private dialogRef: MatDialogRef<EditDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Document,
  ) {
    this.form = this.fb.group({
      title: [data.title, Validators.required],
      description: [data.description],
      category: [data.category],
    });
  }

  save() {
    if (this.loading() || this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.documentService.updateDocument(this.data.id, this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.error.set(err.error?.message ?? 'Error al actualizar el documento');
        this.loading.set(false);
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
