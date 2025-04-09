import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatorDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  perPage: number;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  sortByProperty: string;

  @IsOptional()
  @IsString()
  cityID: string;

  @IsOptional()
  @IsDate()
  from: Date;

  @IsOptional()
  @IsDate()
  to: Date;

  @IsOptional()
  @IsArray()
  cityIDs: string[];
}

export class NeighborhoodPaginatorDto extends PartialType(PaginatorDto) {
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  cityID: string;

  @IsOptional()
  @IsDate()
  from: Date;

  @IsOptional()
  @IsDate()
  to: Date;
}
