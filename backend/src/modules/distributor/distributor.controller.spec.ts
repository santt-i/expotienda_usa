import { Test, TestingModule } from '@nestjs/testing';
import { DistributorController } from './distributor.controller';

describe('DistributorController', () => {
  let controller: DistributorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistributorController],
    }).compile();

    controller = module.get<DistributorController>(DistributorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
