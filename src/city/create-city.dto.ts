import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @IsOptional()
  @IsString()
  uploadUserID: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  id_visible: number;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
  
  @IsOptional()
  @IsDate()
  deletedAt: Date;
  @IsOptional()
  deleted: boolean;
  @IsOptional()
  active: boolean;
}
