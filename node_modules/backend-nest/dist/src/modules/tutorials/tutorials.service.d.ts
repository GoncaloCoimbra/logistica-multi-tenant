export interface Tutorial {
    id: number;
    title: string;
    description: string;
    duration: string;
    category: string;
    transcript: string;
    videoUrl?: string;
}
export declare class TutorialsService {
    private readonly logger;
    private tutorials;
    findAll(page?: number, limit?: number): Promise<{
        data: Tutorial[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: number): Promise<Tutorial | null>;
    findByCategory(category: string, page?: number, limit?: number): Promise<{
        data: Tutorial[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
}
