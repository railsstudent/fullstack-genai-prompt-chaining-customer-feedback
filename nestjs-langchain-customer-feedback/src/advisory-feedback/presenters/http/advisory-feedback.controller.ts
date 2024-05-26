import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdvisoryFeedbackService } from '~advisory-feedback/application/advisory-feedback.service';
import { ChainOutput } from '~advisory-feedback/application/types/chain-output.type';
import { FeedbackDto } from '../dtos/feedback.dto';

const TEST_INPUT_DEFINITION = {
  description: 'An intance of FeedbackDto',
  required: true,
  schema: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'customer feedback',
      },
    },
  },
  examples: {
    positiveChineseFeedback: {
      value: {
        prompt: 'Diginex的ESG 平台非常棒。我將用它來建立 ESG 報告並推薦其他人訂閱該平台。',
      },
    },
    positiveSpanishFeedback: {
      value: {
        prompt: 'La plataforma Diginex es muy útil y poderosa. Lo uso para crear informes y lo recomendaré a otros.',
      },
    },
  },
};

@ApiTags('Advisory Feedback')
@Controller('esg-advisory-feedback')
export class AdvisoryFeedbackController {
  constructor(private service: AdvisoryFeedbackService) {}

  @ApiBody({
    description: 'An intance of FeedbackDto',
    required: true,
    schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'customer feedback',
        },
      },
    },
    examples: {
      positiveFeedback: {
        value: {
          prompt:
            'Looking ahead, the needs of our customers will increasingly be defined by sustainable choices. ESG reporting through diginex has brought us uniformity, transparency and direction. It provides us with a framework to be able to demonstrate to all stakeholders - customers, employees, and investors - what we are doing and to be open and transparent.',
        },
      },
      positiveFeedback2: {
        value: {
          prompt:
            "diginex's product platform is a significant market enabler for companies seeking to gather, manage and disclose ESG data and for investors seeking better quality consistent ESG information.",
        },
      },
      positiveFeedback3: {
        value: {
          prompt:
            'Diginex are an intuitive and exceptional software tool to work with your clients on their ESG requirements. Our users find the system exceptionally easy to use, with guidance at every step of the reporting journey.',
        },
      },
      negativeFeedback: {
        value: {
          prompt:
            'The ESG platform is full of bugs, not user-friendly, and slow to generate reports to PDF and Word document.',
        },
      },
      negativeFeedback2: {
        value: {
          prompt:
            'The ESG platform is missing the data analysis and data visualization features. No chart and graph to display the aggregated data of reports of a company make your software less appealing to your competitors.',
        },
      },
      positiveChineseFeedback: {
        value: {
          prompt: 'Diginex的ESG 平台非常棒。我將用它來建立 ESG 報告並推薦其他人訂閱該平台。',
        },
      },
      positiveSpanishFeedback: {
        value: {
          prompt: 'La plataforma Diginex es muy útil y poderosa. Lo uso para crear informes y lo recomendaré a otros.',
        },
      },
    },
  })
  @ApiResponse({
    description: 'The advisory feedback',
    type: String,
    status: 201,
  })
  @Post()
  createFeedback(@Body() dto: FeedbackDto): Promise<string> {
    return this.service.generateFeedback(dto.prompt);
  }

  @ApiBody(TEST_INPUT_DEFINITION)
  @ApiResponse({
    description: 'The advisory feedback',
    schema: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description: 'language used in the feedback',
        },
        sentiment: {
          type: 'string',
          description: 'sentiment of the feedback',
        },
        topic: {
          type: 'string',
          description: 'what the feedback is about',
        },
      },
    },
    status: 201,
  })
  @Post('test-chains')
  testChains(@Body() dto: FeedbackDto): Promise<ChainOutput> {
    return this.service.testChains(dto.prompt);
  }

  @ApiBody(TEST_INPUT_DEFINITION)
  @ApiResponse({
    description: 'The advisory feedback',
    schema: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description: 'language used in the feedback',
        },
        sentiment: {
          type: 'string',
          description: 'sentiment of the feedback',
        },
        topic: {
          type: 'string',
          description: 'what the feedback is about',
        },
        feedback: {
          type: 'string',
          description: 'the original feedback',
        },
      },
    },
    status: 201,
  })
  @Post('test-runnable-map')
  testRunnableMap(@Body() dto: FeedbackDto): Promise<Record<string, any>> {
    return this.service.testRunnableMap(dto.prompt);
  }
}
