import { Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreateNeighborhoodDto } from './create-neighborhood.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { NeighborhoodPaginatorDto, PaginatorDto } from './neighborhood-paginator.dto';

@Injectable()
export class NeighborhoodService extends PrismaClient implements OnModuleInit, OnModuleDestroy{

  onModuleInit() {
    this.$connect();
  }

  onModuleDestroy() {
    this.$disconnect();
  }


  async createNeighborhood (data: CreateNeighborhoodDto, usuario : any) {
     const neightborhood = await this.neighborhood.create({
          data: {
            id_visible: (await this.neighborhood.count()) + 1,
            ...data,
            uploadUserID: usuario ? usuario.id : undefined,
          },
          include: {
            uploadUser: {
              select: { name: true, last_name: true, id: true, username: true },
            },
            city: true,
          },
        });

        return neightborhood
  }

  async findAllNeighborhood (paginator: NeighborhoodPaginatorDto) {
     //! Filtramos automáticamente los eliminados -------------------->
     let where: Prisma.NeighborhoodWhereInput = { deleted: false };

     if (paginator.id) where = { ...where, id: paginator.id };
     if (paginator.name)
       where = { ...where, name: { contains: paginator.name, mode: 'insensitive' } };
     if (paginator.active != undefined) where = { ...where, active: paginator.active };
 
     const data = await this.neighborhood.findMany({
       where,
       skip: paginator.page && paginator.perPage ? (paginator.page - 1) * paginator.perPage : undefined,
       take: paginator.page && paginator.perPage ? paginator.perPage : undefined,
       orderBy: paginator.sortBy
         ? {
             [paginator.sortByProperty ? paginator.sortByProperty : 'id_visible']: p.sortBy,
           }
         : undefined,
       include: {
         uploadUser: {
           select: { name: true, last_name: true, id: true, username: true },
         },
         city: true,
       },
     });
 
     // Retornamos la data
     return {
       data,
       metadata:
         paginator.page && paginator.perPage
           ? {
               page: paginator.page,
               totalRecords: await this.neighborhood.count({ where }),
               lastPage: Math.ceil(
                 (await this.neighborhood.count({ where })) / paginator.perPage,
               ),
             }
           : {
               totalRecords: await this.neighborhood.count({ where }),
             },
     };
  }

  async findOneNeighborhood (id: string) {
        const neighborhood = await this.neighborhood.findFirst({
          where: { id },
          include: {
            uploadUser: {
              select: { name: true, last_name: true, id: true, username: true },
            },
            city: true,
          },
        });

        if(!neighborhood){
            throw new NotFoundException('Neighborhood not Founf')
        }

        return neighborhood
  }

  async updateNeighborhood (id: string, data: Partial<CreateNeighborhoodDto>) {
    //Reviso si existe
    this.findOneNeighborhood(id)

    const updateNeighborhood = await this.neighborhood.update({
        data: {
          ...data,
        },
        where: { id },
        include: {
          uploadUser: {
            select: { name: true, last_name: true, id: true, username: true },
          },
          city: true,
        },
      });

      return updateNeighborhood
  }

  async deleteNeighborhood (id: string) {
    //Reviso si existe
    await this.findOneNeighborhood(id);
    
    return this.update(id, { deleted: true, deletedAt: new Date() });
  }

  }
