import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  middleName: string = '';

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  userName: string = '';

  @Type(() => Date)
  @ApiProperty()
  @IsDate()
  dob: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  state: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string = '';

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @ApiProperty()
  gender: string;

  @IsUrl()
  @ApiProperty()
  @IsOptional()
  avatarUrl: string =
    'https://msf-theeltal.de/wp-content/uploads/2018/04/no-avatar.jpg';
}
