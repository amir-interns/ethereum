import { Test, TestingModule } from '@nestjs/testing';
import { ProdController } from './prod.controller';

describe('ProdController', () => {
  let controller: ProdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdController],
    }).compile();

    controller = module.get<ProdController>(ProdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
