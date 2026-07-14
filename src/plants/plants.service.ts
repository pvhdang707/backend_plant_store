import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { GetPlantsFilterDto } from './dto/get-plants-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Plant } from './entities/plant.entity';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantsRepository: Repository<Plant>,
  ) {}

  async create(createDto: CreatePlantDto) {
    const plant = this.plantsRepository.create({
      ...createDto,
      category: { id: createDto.categoryId },
    });
    return this.plantsRepository.save(plant);
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;

    const [plants, total] = await this.plantsRepository.findAndCount({
      where: search
        ? { name: Like(`%${search}`), isDeleted: false }
        : { isDeleted: false },
      relations: ['category'],
      skip: skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: plants,
      meta: { total, page, limit },
    };
  }

  async findOne(id: number) {
    const plant = await this.plantsRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['category'],
    });
    if (!plant) throw new NotFoundException('Không tìm thấy cây cảnh này');
    return plant;
  }

  async update(id: number, updatePlantDto: Partial<Plant>) {
    const plant = await this.findOne(id)

    Object.assign(plant, updatePlantDto)

    if(updatePlantDto.category){
      plant.category = {id:updatePlantDto.category} as any
    }
    return this.plantsRepository.save(plant)
  }

  //soft delete
  async remove(id: number) {
    const plant = await this.findOne(id)
    plant.isDeleted = true
    await this.plantsRepository.save(plant)
    return{message: 'Đã xóa thành công'}
  }
}
