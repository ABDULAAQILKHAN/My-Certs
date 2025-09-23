import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    create(req: any): import("./entities/profile.entity").Profile | Promise<import("./entities/profile.entity").Profile | null>;
    findOne(id: string): string;
    update(id: string, updateProfileDto: UpdateProfileDto): string;
    remove(id: string): string;
}
