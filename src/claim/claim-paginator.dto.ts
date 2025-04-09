import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, isString, IsString } from 'class-validator';

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

export class ClaimPaginatorDto extends PartialType(PaginatorDto) {
  @IsOptional()
  @IsBoolean()
  relations: boolean;
 
  @IsOptional()
  @IsBoolean()
  active: boolean;
  
  @IsOptional()
  @IsString()
  id: string;
  
  @IsOptional()
  @IsNumber()
  id_visible: number;
  
  @IsOptional()
  @IsString()
  clientName: string;
  
  @IsOptional()
  @IsString()
  client_lastName: string;
  
  @IsOptional()
  @IsString()
  direction: string;
  
  @IsOptional()
  @IsString()
  neighborhood: string;
 
  @IsOptional()
  @IsString()
  phone: string;
 
  @IsOptional()
  @IsString()
  clientCount: string;
 
  @IsOptional()
  @IsString()
  workerName: string;
 
  @IsOptional()
  @IsString()
  claimType: string;
 
  @IsOptional()
  @IsDate()
  createdAt: Date;
}
