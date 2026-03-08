import { ReferralStatus } from '@prisma/client';
export declare class UpdateReferralDto {
    clientName?: string;
    contactInfo?: string;
    referralSource?: string;
    status?: ReferralStatus;
    projectType?: string;
    estimatedValue?: number;
    referralDate?: string;
    notes?: string;
    referredBy?: string;
    commission?: number;
}
export declare class UpdateReferralStatusDto {
    status: ReferralStatus;
}
