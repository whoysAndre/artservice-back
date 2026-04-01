import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDeveloperDto {
  @ApiProperty({
    example: 'Hi! I need a backend developer for a 3-month project. Are you available?',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  message: string;
}
