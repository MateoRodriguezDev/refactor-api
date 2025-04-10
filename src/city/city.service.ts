import { Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateCityDto } from './create-city.dto';
import { CityPaginatorDto } from './city-paginator.dto';

@Injectable()
export class CityService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  onModuleInit() {
    this.$connect();
  }

  onModuleDestroy() {
    this.$disconnect();
  }


  async createCity(data: CreateCityDto, usuario: any) {
    const city = await this.city.create({
      data: {
        id_visible: (await this.city.count()) + 1,
        ...data,
        uploadUserID: usuario.id,
      },
      include: {
        uploadUser: {
          select: { name: true, last_name: true, id: true, username: true },
        },
      },
    });


    return city
  }

  async findAllCities(paginator: CityPaginatorDto) {
    let where: Prisma.CityWhereInput = { deleted: false };

    if (paginator.id) where = { ...where, id: paginator.id };
    if (paginator.active != undefined) where = { ...where, active: paginator.active };

    // Hacemos un count de los registros (con filtro)
    const totalRecords = await this.city.count({ where });
    // Calculamos la última página
    const lastPage = Math.ceil(totalRecords / paginator.perPage);

    const data = await this.city.findMany({
      where,
      skip: paginator.page && paginator.perPage ? (paginator.page - 1) * paginator.perPage : undefined,
      take: paginator.page && paginator.perPage ? paginator.perPage : undefined,
      orderBy: paginator.sortBy
        ? {
          [paginator.sortByProperty ? paginator.sortByProperty : 'id_visible']: paginator.sortBy,
        }
        : undefined,
      include: {
        uploadUser: {
          select: { name: true, last_name: true, id: true, username: true },
        },
      },
    });

    // Retornamos la data
    return {
      data,
      metadata:
        paginator.page && paginator.perPage
          ? {
            page: paginator.page,
            totalRecords,
            lastPage,
          }
          : {
            totalRecords
          },
    };
  }


  async findOneCity(id: string) {
    const city = await this.city.findFirst({
      where: { id },
      include: {
        uploadUser: {
          select: { name: true, last_name: true, id: true, username: true },
        },
      },
    });

    if (!city) {
      throw new NotFoundException('City not Found')
    }

    return city
  }


  async updateCity(id: string, data: Partial<CreateCityDto>) {
    //Reviso si la ciudad existe
    await this.findOneCity(id);
  
    const updatedCity = await this.city.update({
      where: { id },
      data,
      include: {
        uploadUser: {
          select: { name: true, last_name: true, id: true, username: true },
        },
      },
    });
  
    return updatedCity;
  }
  

  async deleteCity(id: string) {

    await this.updateCity(id, { deleted: true, deletedAt: new Date() })

    return `This action removes a #${id} claim`;
  }


}
