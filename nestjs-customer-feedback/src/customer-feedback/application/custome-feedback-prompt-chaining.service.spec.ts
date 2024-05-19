import { Test, TestingModule } from '@nestjs/testing';
import { CustomeFeedbackPromptChainingService } from './custome-feedback-prompt-chaining.service';

describe('CustomeFeedbackPromptChainingService', () => {
  let service: CustomeFeedbackPromptChainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomeFeedbackPromptChainingService],
    }).compile();

    service = module.get<CustomeFeedbackPromptChainingService>(CustomeFeedbackPromptChainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
