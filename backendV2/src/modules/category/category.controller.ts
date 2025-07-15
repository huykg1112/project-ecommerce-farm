import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@root/src/cloudinary/cloudinary.service';
import { Public } from '@root/src/public.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoriesService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  // @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesService.findByName(
      createCategoryDto.name,
    );
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    return this.categoriesService.create(createCategoryDto);
  }

  @Post('with-image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  async createWithImage(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;
    let publicId: string | null = null;

    const existingCategory = await this.categoriesService.findByName(
      createCategoryDto.name,
    );
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      imageUrl = result.url;
      publicId = result.public_id;
    }

    return this.categoriesService.createWithImage(
      createCategoryDto,
      imageUrl,
      publicId,
    );
  }
  //update with image
  @Post('update-with-image/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async updateWithImage(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;
    let publicId: string | null = null;

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      imageUrl = result.url;
      publicId = result.public_id;
    }

    return this.categoriesService.updateCategoryWithImage(
      id,
      updateCategoryDto,
      imageUrl,
      publicId,
    );
  }

  @Get()
  @Public()
  findAll() {
    console.log('Fetching all categories');
    return this.categoriesService.findAll();
  }

  @Get('active')
  @Public()
  findActiveCategories() {
    return this.categoriesService.findActiveCategories();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.categoriesService.softDelete(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.categoriesService.restore(id);
  }

  @Patch(':id/update-status')
  updateCategoryStatus(@Param('id') id: string) {
    return this.categoriesService.toggleStatus(id);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadCategoryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const result = await this.cloudinaryService.uploadImage(file);
    return this.categoriesService.updateCategoryImage(
      id,
      result.url,
      result.public_id,
    );
  }
}
