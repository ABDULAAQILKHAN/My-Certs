import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
constructor(
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>,
) {}

create(createProfileDto: CreateProfileDto) {

  const found = this.profileRepository.findOneBy({userId: createProfileDto.sub});
  if (found) {
    return found;
  }
  const user = {
    userId: createProfileDto.sub,
    name: createProfileDto.name,
    email: createProfileDto.email,
    phone: createProfileDto.phone,
  }
  const result = this.profileRepository.create(user);
  this.profileRepository.save(result);
  return result;
}
  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
