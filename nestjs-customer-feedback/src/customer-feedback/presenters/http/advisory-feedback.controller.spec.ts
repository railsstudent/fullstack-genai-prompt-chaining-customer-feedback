import { Test, TestingModule } from '@nestjs/testing';
import { AdvisoryFeedbackController } from './advisory-feedback.controller';

describe('AdvisoryFeedbackController', () => {
  let controller: AdvisoryFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvisoryFeedbackController],
    }).compile();

    controller = module.get<AdvisoryFeedbackController>(AdvisoryFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
