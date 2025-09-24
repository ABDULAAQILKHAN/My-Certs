import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
export declare class ProfileService {
    private profileRepository;
    constructor(profileRepository: Repository<Profile>);
    create(createProfileDto: CreateProfileDto): Profile | Promise<Profile | null>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateProfileDto: UpdateProfileDto): string;
    remove(id: number): string;
}
