import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  OnModuleDestroy,
  OnModuleInit,
  BadRequestException,
} from '@nestjs/common';
import { CreateCityDto } from './create-city.dto';
import { CityPaginatorDto } from './city-paginator.dto';
import { Owner } from '@/common/decorators/user.decorator';
import { Prisma, PrismaClient } from '@prisma/client';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) { }

  @Post()
  async create(@Body() data: CreateCityDto, @Owner() usuario: any) {

    return this.cityService.createCity(data, usuario);
  }

  @Get()
  async findAll(@Query() paginator: CityPaginatorDto) {
    return this.cityService.findAllCities(paginator)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.cityService.findOneCity(id)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateCityDto>) {

    return this.cityService.updateCity(id, data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.deleteCity(id)
  }
}
