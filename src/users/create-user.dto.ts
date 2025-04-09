import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  id_visible: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsEmail()
  mail: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  id_user?: string;

  @IsOptional()
  @IsArray()
  updateCityID: string[];

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean = false;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;

  @IsOptional()
  @IsBoolean()
  otp?: boolean;

  @IsOptional()
  @IsBoolean()
  root?: boolean;

  @IsOptional()
  @IsDate()
  createdDate: Date;

  @IsOptional()
  @IsDate()
  deleteDate?: Date;

  @IsOptional()
  @IsString()
  old_password: string;

  @IsOptional()
  @IsArray()
  deletedCityID: string[];
}
