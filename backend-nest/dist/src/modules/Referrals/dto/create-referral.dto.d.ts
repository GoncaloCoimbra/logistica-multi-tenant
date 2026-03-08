import { ReferralStatus } from '@prisma/client';
export declare class CreateReferralDto {
    clientName: string;
    contactInfo: string;
    referralSource?: string;
    status?: ReferralStatus;
    projectType: string;
    estimatedValue: number;
    referralDate: string;
    notes?: string;
    referredBy: string;
    commission?: number;
    companyId?: string;
}
