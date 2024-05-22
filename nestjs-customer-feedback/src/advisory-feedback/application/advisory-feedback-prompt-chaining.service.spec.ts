import { Test, TestingModule } from '@nestjs/testing';
import { AdvisoryFeedbackPromptChainingService } from './advisory-feedback-prompt-chaining.service';

describe('AdvisoryFeedbackPromptChainingService', () => {
  let service: AdvisoryFeedbackPromptChainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvisoryFeedbackPromptChainingService],
    }).compile();

    service = module.get<AdvisoryFeedbackPromptChainingService>(AdvisoryFeedbackPromptChainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
