export interface Document {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    filePath: string;
    currentVersion: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface DocumentsResponse {
    data: Document[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
