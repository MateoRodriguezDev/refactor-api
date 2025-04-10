import { Owner } from '@/common/decorators/user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  OnModuleDestroy,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateNeighborhoodDto } from './create-neighborhood.dto';
import { NeighborhoodPaginatorDto } from './neighborhood-paginator.dto';
import { NeighborhoodService } from './neighborhood.service';

@Controller('neighborhood')
export class NeighborhoodController
{

    constructor(private neighborhoodService: NeighborhoodService) { }
  

  @Post()
  async createNeighborhood(@Body() data: CreateNeighborhoodDto, @Owner() usuario) {
   return this.neighborhoodService.createNeighborhood(data, usuario)
  }

  @Get()
  async findAllNeighborhood(@Query() paginator: NeighborhoodPaginatorDto) {
   return this.neighborhoodService.findAllNeighborhood(paginator)
  }

  @Get(':id')
  findOneNeighborhood(@Param('id') id: string) {
    return this.neighborhoodService.findOneNeighborhood(id)
  }

  @Patch(':id')
  updateNeighborhood(
    @Param('id') id: string,
    @Body() data: Partial<CreateNeighborhoodDto>,
  ) {
    return this.neighborhoodService.updateNeighborhood(id, data)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.neighborhoodService.deleteNeighborhood(id)
  }
}
