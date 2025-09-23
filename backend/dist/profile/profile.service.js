"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("./entities/profile.entity");
let ProfileService = class ProfileService {
    profileRepository;
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }
    create(createProfileDto) {
        const found = this.profileRepository.findOneBy({ userId: createProfileDto.sub });
        if (found) {
            return found;
        }
        const user = {
            userId: createProfileDto.sub,
            name: createProfileDto.name,
            email: createProfileDto.email,
            phone: createProfileDto.phone,
        };
        const result = this.profileRepository.create(user);
        this.profileRepository.save(result);
        return result;
    }
    findAll() {
        return `This action returns all profile`;
    }
    findOne(id) {
        return `This action returns a #${id} profile`;
    }
    update(id, updateProfileDto) {
        return `This action updates a #${id} profile`;
    }
    remove(id) {
        return `This action removes a #${id} profile`;
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map