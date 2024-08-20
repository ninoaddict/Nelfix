import { Test, TestingModule } from '@nestjs/testing';
import { MylistController } from './mylist.controller';

describe('MylistController', () => {
  let controller: MylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MylistController],
    }).compile();

    controller = module.get<MylistController>(MylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
