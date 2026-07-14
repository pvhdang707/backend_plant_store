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
  BadRequestException,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { GetPlantsFilterDto } from './dto/get-plants-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get()
  findAll(
    @Query('page') page:string,
    @Query('limit') limit:string,
    @Query('search') search:string,
  ){
    return this.plantsService.findAll(+page||1,+limit||10,search)
  }

  @Get('id')
  findOne(@Param('id') id:string){
    return this.plantsService.findOne(+id)
  }
  
  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // create(
  //   @Body() createPlantDto: CreatePlantDto,
  //   @GetUser('userId') userId: number,
  //   @GetUser('email') email: string,
  // ) {
  //   console.log(`Người dùng [${email}] (ID: ${userId}) đang thêm cây mới.`);
  //   return this.plantsService.create(createPlantDto);
  // }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('image',{
  //   // cấu hình nơi lưu giữ
  //   storage: diskStorage({
  //     destination:'./uploads', //thư mục lưu file trên Server
  //     filename: (req,file,callback)=>{
  //       //đổi tên file tránh trùng 
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() *1e9)
  //       const ext = extname(file.originalname)
  //       const filename = `${uniqueSuffix}${ext}`
  //       callback(null,filename)
  //     }
  //   }),
  //   // chặn các file không phải ảnh
  //   fileFilter: (req,file,callback)=>{
  //     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
  //       return callback(new BadRequestException('Chi chap nhan file anh'),false)
  //     }
  //     callback(null,true)
  //   },
  //   // giới hạn dung lượng
  //   limits:{fileSize:5*1024*1024}
  // }))
  // uploadFile(@UploadedFile() file:Express.Multer.File){
  //   if(!file){
  //     throw new BadRequestException('Khong tim thay file')
  //   }

  //   return{
  //     message: 'Upload anh thanh cong',
  //     filePath: `/uploads/${file.filename}`
  //   }
  // }

  // @Get()
  // findAll(@Query() filterDto: GetPlantsFilterDto) {
  //   return this.plantsService.findAll(filterDto);
  // }



  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPlantDto: CreatePlantDto){
    return this.plantsService.create(createPlantDto)
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantDto: UpdatePlantDto) {
    return this.plantsService.update(+id, updatePlantDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantsService.remove(+id);
  }
}
