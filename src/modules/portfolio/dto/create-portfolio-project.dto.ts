import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioProjectDto {
  @ApiProperty({ example: 'E-commerce platform', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'Built a full-stack store with Next.js and Stripe.', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({ example: 'https://myproject.com' })
  @IsOptional()
  @IsUrl()
  projectUrl?: string;
}
