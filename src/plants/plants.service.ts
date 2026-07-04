/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPlantsFilterDto } from './dto/get-plants-filter.dto';

@Injectable()
export class PlantsService {
  constructor(private prisma: PrismaService) {}

  async create(createPlantDto: CreatePlantDto) {
    const newPlant = await this.prisma.plants.create({
      data: {
        name: createPlantDto.name,
        price: createPlantDto.price,
        wateringInstruction: createPlantDto.wateringInstruction,
        categoryId: createPlantDto.categoryId,
      },
    });
    return {
      message: 'them cay moi thanh cong',
      data: newPlant,
    };
  }

  async findAll(filterDto: GetPlantsFilterDto) {
    // giá trị mặc định
    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const search = filterDto.search || '';

    //tính số lượng cần bỏ qua
    const skip = (page - 1) * limit;

    // điều kiện lọc (where)
    const whereCondition = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const, //Tìm gần đúng, không phân biệt hoa thường
          },
        }
      : {};

      // gọi db song song (lấy dữu liệu và đếm tổng số)
      const [plants, totalRecords] = await Promise.all([
        this.prisma.plant.findMany({
          where: whereCondition,
          skip:skip,
          take:limit,
          include: {category: true}, //lấy thông tin category
        }), 
        this.prisma.plant.count({where: whereCondition}) //tổng cây thỏa query
      ])
   
      // tính tổng số trang
      const totalPages = Math.ceil(totalRecords/limit)
    

    return {
      data: plants,
      meta:{
        totalRecords,
        totalPages,
        currentPage:page,
        itemsPerPage:limit,
      }
    }
  }

  findOne(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const plant = this.prisma.plants.find((p) => p.id === id);
    if (!plant) {
      throw new NotFoundException('not found');
    }
    return plant;
  }

  update(id: number, updatePlantDto: UpdatePlantDto) {
    return `This action updates a #${id} plant`;
  }

  remove(id: number) {
    return `This action removes a #${id} plant`;
  }
}
