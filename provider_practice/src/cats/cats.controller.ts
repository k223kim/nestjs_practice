import { Controller, Get, Post, Body , Inject} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { ServiceB } from './serviceB';
import { ConvenientServiceB } from './convenientServiceB';
import { CatOutsideClass } from './notClassProvider';
import { CatNameService } from './catNameService';

@Controller('cats')
export class CatsController {
  constructor(
      private catsService: CatsService,
      private readonly serviceB: ServiceB,
      private readonly convenientServiceB: ConvenientServiceB,
      @Inject('outdoorCat') private readonly outdoorCat: CatOutsideClass,
      @Inject('weirdCat') private readonly catConst,
      private readonly catNameService: CatNameService
  ) {}
  //CatsService provider is injected by Nest

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get('/serviceB')
  getCat(): string{
      return this.serviceB.getCat();
  }

  @Get('/convenientServiceB')
  getConvenientCat(): string {
      return this.convenientServiceB.getCat();
  }

  @Get('/outdoor')
  getOutdoorCatOutput(): string {
      return this.outdoorCat.getOutdoorCat();
  }

  @Get('/getWeirdCat')
  getWeirdCat(): string {
      return this.catConst;
  }

  @Get('/getCatName')
  getCatName(): string {
      return this.catNameService.getCatName();
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
