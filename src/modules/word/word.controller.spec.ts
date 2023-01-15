import { Test, TestingModule } from '@nestjs/testing';
import { WordController } from './Word.controller';
import { WordService } from './Word.service';

describe('WordController', () => {
  let controller: WordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordController],
      providers: [WordService],
    }).compile();

    controller = module.get<WordController>(WordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
