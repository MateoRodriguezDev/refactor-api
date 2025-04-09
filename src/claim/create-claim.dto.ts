import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClaimDto {
  @IsOptional()
  @IsNumber()
  id_visible: number;
  
  @IsOptional()
  @IsString()
  uploadUserID: string;
  
  @IsOptional()
  @IsString()
  direction: string;
  
  @IsOptional()
  @IsString()
  clientLastName: string;
  
  @IsOptional()
  @IsString()
  clientName: string;
  
  @IsOptional()
  @IsString()
  clientCount: string;
  
  @IsOptional()
  @IsString()
  phone: string;
  
  @IsOptional()
  @IsString()
  description: string;
  
  @IsOptional()
  @IsString()
  claimTypeID: string;
 
  @IsOptional()
  @IsString()
  neighborhoodID: string;
 
  @IsOptional()
  @IsString()
  workerID: string;
 
  @IsOptional()
  @IsString()
  tasks: string;
 
  @IsOptional()
  newWorkWith: any;
 
  @IsOptional()
  @IsString()
  id: string;
 
  @IsOptional()
  @IsDate()
  closeAt: Date;
 
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
  
  @IsOptional()
  @IsDate()
  createdAt: Date;
}
