import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  OnModuleDestroy,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Prisma, PrismaClient } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClaimPaginatorDto } from './claim-paginator.dto';
import { CreateClaimDto } from './create-claim.dto';
import { Owner } from '@/common/decorators/user.decorator';
import { ClaimService } from './claim.service';

export interface Data {
  value: number;
  data: {
    id: string;
    name: string;
    value: number;
    types: { id: string; name: string; value: number }[];
  }[];
}

@Controller('claim')
export class ClaimController
{

  constructor(private claimService: ClaimService) { }

  //# Estadísticas -------------------------------------->
  @Get('claim-location')
  async getReportByCity(@Query() paginator: ClaimPaginatorDto) {
   return this.claimService.getReportByCity(paginator)
  }
  //# Estadísticas -------------------------------------->

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(@Body() data: any, @Owner() usuario: any) {
    return this.claimService.createClaim(data,  usuario)
  }

  @Get()
  async findAllClaims(@Query() paginator: ClaimPaginatorDto) {
    return this.claimService.findAllClaims(paginator)
  }

  @Get(':id')
  findOneClaim(@Param('id', ParseUUIDPipe) id: string) {
    return this.claimService.findOneClaim(id)
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async updateClaim(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
   return this.claimService.updateClaim(id, data)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return  this.claimService.deleteClaim(id)
  }
}
