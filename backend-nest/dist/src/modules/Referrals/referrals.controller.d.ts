import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto, UpdateReferralStatusDto } from './dto/update-referral.dto';
import { FilterReferralDto } from './dto/filter-referral.dto';
import { ReferralResponseDto, ReferralStatsDto } from './dto/referrals.dto';
export declare class ReferralsController {
    private readonly referralsService;
    constructor(referralsService: ReferralsService);
    create(createReferralDto: CreateReferralDto, req: any): Promise<ReferralResponseDto>;
    findAll(filterDto: FilterReferralDto, req: any): Promise<ReferralResponseDto[]>;
    getStats(companyId: string, req: any): Promise<ReferralStatsDto>;
    findOne(id: string, req: any): Promise<ReferralResponseDto>;
    update(id: string, updateReferralDto: UpdateReferralDto, req: any): Promise<ReferralResponseDto>;
    updateStatus(id: string, updateStatusDto: UpdateReferralStatusDto, req: any): Promise<ReferralResponseDto>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
