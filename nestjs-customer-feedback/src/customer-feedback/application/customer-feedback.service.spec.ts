import { Test, TestingModule } from '@nestjs/testing';
import { CustomerFeedbackService } from './customer-feedback.service';

describe('CustomerFeedbackService', () => {
  let service: CustomerFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerFeedbackService],
    }).compile();

    service = module.get<CustomerFeedbackService>(CustomerFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
