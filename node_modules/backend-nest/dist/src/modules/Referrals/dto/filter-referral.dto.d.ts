import { ReferralStatus } from '@prisma/client';
export declare class FilterReferralDto {
    status?: ReferralStatus;
    projectType?: string;
    referralSource?: string;
    referredBy?: string;
    referralDateBefore?: string;
    referralDateAfter?: string;
    search?: string;
    companyId?: string;
}
