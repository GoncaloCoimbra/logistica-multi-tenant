import { TutorialsService } from './tutorials.service';
export declare class TutorialsController {
    private readonly tutorialsService;
    private readonly logger;
    constructor(tutorialsService: TutorialsService);
    findAll(page?: string, limit?: string): Promise<{
        data: import("./tutorials.service").Tutorial[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findByCategory(category: string, page?: string, limit?: string): Promise<{
        data: import("./tutorials.service").Tutorial[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    findOne(id: string): Promise<{
        error: string;
        data?: undefined;
    } | {
        data: import("./tutorials.service").Tutorial;
        error?: undefined;
    }>;
}
