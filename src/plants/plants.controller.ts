import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { GetPlantsFilterDto } from './dto/get-plants-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createPlantDto: CreatePlantDto,
    @GetUser('userId') userId: number,
    @GetUser('email') email: string,
  ) {
    console.log(`Người dùng [${email}] (ID: ${userId}) đang thêm cây mới.`);
    return this.plantsService.create(createPlantDto);
  }

  @Get()
  findAll(@Query() filterDto: GetPlantsFilterDto) {
    return this.plantsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantDto: UpdatePlantDto) {
    return this.plantsService.update(+id, updatePlantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
