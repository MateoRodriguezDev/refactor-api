import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsDate()
  cityIDs: string[];
}

export class CityPaginatorDto extends PartialType(PaginatorDto) {
  @IsOptional()
  @IsBoolean()
  relations: boolean;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  id: string;
}
