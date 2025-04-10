import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ClaimPaginatorDto, PaginatorDto } from './claim-paginator.dto';
import { CreateClaimDto } from './create-claim.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ClaimService extends PrismaClient implements OnModuleInit, OnModuleDestroy{


    onModuleInit() {
        this.$connect();
      }
    
      onModuleDestroy() {
        this.$disconnect();
      }


      async getReportByCity(paginator: ClaimPaginatorDto){
        const { from, to, cityIDs } = paginator;

        const startDate = new Date(from.setHours(0, 0, 0, 0));
        const endDate = new Date(to.setHours(23, 59, 59, 999));
        
        const claims = await this.claim.findMany({
          where: {
            active: true,
            deleted: false,
            createdAt: { gte: startDate, lte: endDate },
            neighborhood: { city: { id: { in: cityIDs } } },
          },
          include: {
            neighborhood: { include: { city: true } },
          },
        });
        
        const neighborhoodSummary: {
          id: string;
          cities: { id: string; cityName: string; claimCount: number }[];
        }[] = [];
        
        claims.forEach((claim) => {
          let neighborhoodIndex = neighborhoodSummary.findIndex(
            (item) => item.id === claim.neighborhood.id
          );
        
          if (neighborhoodIndex < 0) {
            neighborhoodSummary.push({
              id: claim.neighborhood.id,
              cities: [],
            });
            neighborhoodIndex = neighborhoodSummary.length - 1;
          }
        
          let cityIndex = neighborhoodSummary[neighborhoodIndex].cities.findIndex(
            (city) => city.id === claim.neighborhood.city.id
          );
        
          if (cityIndex < 0) {
            neighborhoodSummary[neighborhoodIndex].cities.push({
              id: claim.neighborhood.city.id,
              cityName: claim.neighborhood.city.name,
              claimCount: 0,
            });
            cityIndex = neighborhoodSummary[neighborhoodIndex].cities.length - 1;
          }
        
          neighborhoodSummary[neighborhoodIndex].cities[cityIndex].claimCount += 1;
        });
        
        return neighborhoodSummary;
        
      }

      async createClaim (data: any, usuario: any) {
        try {
              if (!data.form || typeof data.form !== 'string') {
                throw new BadRequestException('Missing or invalid "form" field.');
              }
        
              const parsedData = JSON.parse(data.form);
        
              const body = plainToInstance(CreateClaimDto, parsedData);
        
              const errors = await validate(body);
        
              if (errors.length > 0) {
                throw new BadRequestException(
                  `Validation failed: ${errors
                    .map((error) => Object.values(error.constraints || {}).join(', '))
                    .join('; ')}`,
                );
              }
        
              return this.claim.create({
                data: {
                  ...body,
                  id_visible: (await this.claim.count()) + 1,
                  uploadUserID: usuario ? usuario.id : undefined,
                },
                include: { uploadUser: true },
              });
            } catch (error) {
              if (error instanceof SyntaxError) {
                throw new BadRequestException('Data is not valid JSON.');
              }
              throw error; // Propagar otros errores no relacionados
            }
      }

      //Me falto optimizar esta funcion
      async findAllClaims(paginator: ClaimPaginatorDto) {
        let where: Prisma.ClaimWhereInput = { deleted: false };
        let skip;
        let take;
        let orderBy;
        let metadata;
      
        if (paginator.id) where = { ...where, id: paginator.id };
        if (paginator.id_visible) where = { ...where, id_visible: paginator.id_visible };
        if (paginator.claimType) where = { ...where };
      
        if (paginator.neighborhood)
          where = {
            ...where,
            neighborhood: {
              name: {
                contains: paginator.neighborhood,
                mode: 'insensitive',
              },
            },
          };
      
        if (paginator.clientName)
          where = {
            ...where,
            clientName: {
              contains: paginator.clientName,
              mode: 'insensitive',
            },
          };
      
        if (paginator.client_lastName)
          where = {
            ...where,
            clientLastName: {
              contains: paginator.client_lastName,
              mode: 'insensitive',
            },
          };
      
        if (paginator.phone)
          where = {
            ...where,
            phone: {
              contains: paginator.phone,
              mode: 'insensitive',
            },
          };
      
        if (paginator.clientCount)
          where = {
            ...where,
            clientCount: {
              contains: paginator.clientCount,
              mode: 'insensitive',
            },
          };
      
        where = {
          ...where,
          direction: {
            contains: paginator.direction,
            mode: 'insensitive',
          },
        };
      
        if (paginator.createdAt) {
          const startDate = new Date(paginator.createdAt.setHours(0, 0, 0, 0));
          const endDate = new Date(paginator.createdAt.setHours(23, 59, 59, 999));
          where = {
            ...where,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          };
        }
      
        if (paginator.active != undefined) where = { ...where, active: paginator.active };
      
        if (paginator.cityIDs)
          where = {
            ...where,
            neighborhood: {
              name: paginator.neighborhood
                ? {
                    contains: paginator.neighborhood,
                    mode: 'insensitive',
                  }
                : undefined,
              city: {
                OR: [
                  {
                    name: {
                      contains: paginator.cityIDs[0],
                      mode: 'insensitive',
                    },
                  },
                  { id: { in: paginator.cityIDs } },
                ],
              },
            },
          };
      
        // Hacemos un count de los registros (con filtro)
        const totalRecords = await this.claim.count({ where });
      
        // Calculamos la última página
        const lastPage = Math.ceil(totalRecords / paginator.perPage);
      
        if (paginator.page && paginator.perPage) {
          skip = (paginator.page - 1) * paginator.perPage;
          take = paginator.perPage;
        }
      
        if (paginator.sortBy)
          orderBy = {
            [paginator.sortByProperty ? paginator.sortByProperty : 'id_visible']: paginator.sortBy,
          };
      
        const claims = await this.claim.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            neighborhood: true,
            uploadUser: {
              select: { name: true, last_name: true, id: true, username: true },
            },
          },
        });
      
        // Definimos los metadatos extras
        if (paginator.page && paginator.perPage) {
          //! Si hay un paginator activo
          metadata = {
            page: paginator.page,
            totalRecords,
            lastPage,
          };
        } else {
          //! O se trajeron los datos completos
          metadata = {
            totalRecords,
          };
        }
      
        // Retornamos la data
        return { data: claims, metadata };
      }
      
      async findOneClaim (id: string) {
        
        const claim = await this.claim.findFirst({
          where: { id },
          include: {
            neighborhood: true,
            uploadUser: {
              select: { name: true, last_name: true, id: true, username: true },
            },
          },
        });

        if(!claim){
          throw new NotFoundException('Claim not found')
        }
        
        return claim
      }

      async updateClaim (id: string, data: any) {

        //Verifico si existe primero
        this.findOneClaim(id)

        try {
          if (!data.form || typeof data.form !== 'string') {
            throw new BadRequestException('Missing or invalid "form" field.');
          }
    
          const parsedData = JSON.parse(data.form);
    
          const body = plainToInstance(CreateClaimDto, parsedData);
    
          const errors = await validate(body);
    
          if (errors.length > 0) {
            throw new BadRequestException(
              `Validation failed: ${errors
                .map((error) => Object.values(error.constraints || {}).join(', '))
                .join('; ')}`,
            );
          }

          const updatedClaim = await this.claim.update({
            data: {
              ...body,
            },
            where: { id },
            include: {
              neighborhood: true,
              uploadUser: {
                select: { name: true, last_name: true, id: true, username: true },
              },
            },
          });
      
          return updatedClaim;

  
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new BadRequestException('Data is not valid JSON.');
          }
          throw error; // Propagar otros errores no relacionados
        }
      }

      async deleteClaim(id: string) {
        return this.updateClaim(id, { deleted: true, deletedAt: new Date() });
      }

}
