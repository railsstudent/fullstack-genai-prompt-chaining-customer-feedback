import { Test, TestingModule } from '@nestjs/testing';
import { AdvisoryFeedbackService } from './advisory-feedback.service';

describe('AdvisoryFeedbackService', () => {
  let service: AdvisoryFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvisoryFeedbackService],
    }).compile();

    service = module.get<AdvisoryFeedbackService>(AdvisoryFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
