import { Test, TestingModule } from '@nestjs/testing';
import { CatIdController } from './cat-id.controller';

describe('CatIdController', () => {
  let controller: CatIdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatIdController],
    }).compile();

    controller = module.get<CatIdController>(CatIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
