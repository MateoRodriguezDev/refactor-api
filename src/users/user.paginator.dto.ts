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
  @IsString({ each: true })
  cityIDs: string[];
}

export class UserPaginator extends PartialType(PaginatorDto) {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  mail: string;

  @IsOptional()
  @IsBoolean()
  delete: boolean;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsBoolean()
  root: boolean;
}
