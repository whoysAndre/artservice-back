import { Specialty } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsString, IsUrl, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeveloperProfileDto {
  @ApiProperty({
    enum: Specialty,
    isArray: true,
    example: [Specialty.BACKEND, Specialty.FULLSTACK],
  })
  @IsArray()
  @IsEnum(Specialty, { each: true })
  specialties: Specialty[];

  @ApiProperty({ example: 50, minimum: 0 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ example: 'https://github.com/username' })
  @IsString()
  @IsUrl()
  githubUrl: string;
}
