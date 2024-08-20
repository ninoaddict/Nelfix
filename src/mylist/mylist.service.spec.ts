import { Test, TestingModule } from '@nestjs/testing';
import { MylistService } from './mylist.service';

describe('MylistService', () => {
  let service: MylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MylistService],
    }).compile();

    service = module.get<MylistService>(MylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
