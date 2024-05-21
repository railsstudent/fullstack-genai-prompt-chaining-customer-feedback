import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
