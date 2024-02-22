import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { ServiceB } from './cats/serviceB';
import { ServiceA } from './cats/serviceA';
import { ConvenientServiceB } from './cats/convenientServiceB';
import { CatOutsideClass } from './cats/notClassProvider';
import { weirdCatConst } from './cats/weirdCat';
import { CatNameService } from './cats/catNameService';

const mockServiceA = {
    getCat: function mockGetCat(){
        return 'this is mocking serviceA for testing!';
    }
}

const testCatNameService = new CatNameService();
testCatNameService.setCatName('testCatName');

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService, ServiceB, ServiceA, ConvenientServiceB,
      {provide: 'outdoorCat', useClass: CatOutsideClass},
      {provide: 'weirdCat', useValue: weirdCatConst},
      {provide: ServiceA, useValue: mockServiceA},
      {provide: CatNameService, useValue: testCatNameService},
      CatNameService
  ],
})
export class AppModule {}
