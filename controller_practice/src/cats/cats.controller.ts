import { Controller, Get, Post, Body, Patch, Param, Delete , Req, HttpCode, Header, Query, Redirect} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto , GetCatDto} from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Header('Cache-Control', 'none')
  create(@Body() createCatDto: CreateCatDto) {
      const {name, id} = createCatDto;
      return `This action adds a cat with name: ${name} and id: ${id}!`
  }

  @Get('ab*cd')
  findAll(@Req() request: Request): string {
      console.log(request);
    return this.catsService.findAll();
  }

  @Get()
  getDto(@Query() info: GetCatDto){
      const {offset, limit} = info;
      return `got offset: ${offset}, limit: ${limit}`;
  }

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
      getDocs(@Query('version') version: string){
      if (version && version === '5'){
          return {url: 'https://docs.nestjs.com/v5/'};
      }
  }
  @Get(':id/:number')
  findOne(
      @Param('id') id: string,
      @Param('number') number: string
  ){
    return `id: ${id}, number: ${number}`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
