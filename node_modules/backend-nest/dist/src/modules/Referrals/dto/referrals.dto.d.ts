import { ReferralStatus } from '@prisma/client';
export declare class ReferralResponseDto {
    id: string;
    clientName: string;
    contactInfo: string;
    referralSource: string;
    status: ReferralStatus;
    projectType: string;
    estimatedValue: number;
    referralDate: Date;
    notes: string | null;
    referredBy: string;
    commission: number | null;
    createdAt: Date;
    updatedAt: Date;
    companyId: string;
}
export declare class ReferralStatsDto {
    total: number;
    new: number;
    contacted: number;
    converted: number;
    lost: number;
    totalEstimatedValue: number;
    totalCommission: number;
    conversionRate: number;
}
