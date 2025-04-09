import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNeighborhoodDto {
  @IsOptional()
  @IsNumber()
  id_visible: number;

  @IsOptional()
  @IsString()
  uploadUserID: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  zoneID: string;

  @IsOptional()
  @IsString()
  cityID: string;

  @IsOptional()
  @IsArray()
  coordinates: string[];

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
