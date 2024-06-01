import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdvisoryFeedbackService } from '~advisory-feedback/application/advisory-feedback.service';
import { FeedbackDto } from '../dtos/feedback.dto';

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
            'The ESG platform is full of bugs, not user-friendly, and slow to generate reports to PDF and Word document. I need to reload a specific page, or a temporary slowdown on a certain feature',
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
          prompt: '這個新流程讓我們成功地縮減了至少50%的工時，不僅節省大量時間，也協助我們將報告需求擴展到嶄新境界。',
        },
      },
      positiveChineseFeedback2: {
        value: {
          prompt:
            '資料的完整可追溯性和數位稽核可以深入至儲存格層級，再加上即時變更，讓我們能掌握在報表中更新的動態並提供透明度。',
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
}
