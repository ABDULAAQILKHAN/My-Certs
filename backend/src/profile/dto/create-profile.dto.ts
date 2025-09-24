import { IsString, IsEmail, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import e from 'express';

export class CreateProfileDto {
  // @IsString()
  // @MinLength(2, { message: 'First name must be at least 2 characters long' })
  // @Transform(({ value }) => value?.trim())
  // firstName: string;

  // @IsString()
  // @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  // @Transform(({ value }) => value?.trim())
  // lastName: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  sub: string;

  @IsString()
  @MinLength(2, { message: 'name must be at least 3 characters long' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  avatar?: string;
}