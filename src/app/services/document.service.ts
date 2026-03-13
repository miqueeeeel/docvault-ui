import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document, DocumentsResponse } from '../models/document.model';
import { Version } from '../models/version.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getDocuments(params: {
        search?: string;
        category?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }): Observable<DocumentsResponse> {
        let httpParams = new HttpParams();
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.category) httpParams = httpParams.set('category', params.category);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);
        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

        return this.http.get<DocumentsResponse>(`${this.apiUrl}/documents`, { params: httpParams });
    }

    getAdminDocuments(params: {
        search?: string;
        category?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }): Observable<DocumentsResponse> {
        let httpParams = new HttpParams();
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.category) httpParams = httpParams.set('category', params.category);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);
        if (params.page) httpParams = httpParams.set('page', params.page.toString());
        if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

        return this.http.get<DocumentsResponse>(`${this.apiUrl}/documents/admin/all`, { params: httpParams });
    }

    getDocument(id: string): Observable<Document> {
        return this.http.get<Document>(`${this.apiUrl}/documents/${id}`);
    }

    uploadDocument(formData: FormData): Observable<Document> {
        return this.http.post<Document>(`${this.apiUrl}/documents`, formData);
    }

    updateDocument(id: string, data: Partial<Document>): Observable<Document> {
        return this.http.patch<Document>(`${this.apiUrl}/documents/${id}`, data);
    }

    deleteDocument(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/documents/${id}`);
    }

    adminDeleteDocument(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/documents/admin/${id}`);
    }

    downloadDocument(id: string): void {
        const token = localStorage.getItem('docvault_token');
        window.open(`${this.apiUrl}/documents/${id}/download?token=${token}`, '_blank');
    }

    getVersions(documentId: string): Observable<Version[]> {
        return this.http.get<Version[]>(`${this.apiUrl}/documents/${documentId}/versions`);
    }

    uploadVersion(documentId: string, formData: FormData): Observable<Version> {
        return this.http.post<Version>(`${this.apiUrl}/documents/${documentId}/versions`, formData);
    }

    downloadVersion(versionId: string): void {
        const token = localStorage.getItem('docvault_token');
        window.open(`${this.apiUrl}/versions/${versionId}/download?token=${token}`, '_blank');
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }

    updateUserRole(userId: string, role: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/users/${userId}/role`, { role });
    }
}
