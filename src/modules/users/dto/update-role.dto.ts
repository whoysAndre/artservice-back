import { IsEnum } from 'class-validator';
import { Roles } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: Roles, example: Roles.DEVELOPER })
  @IsEnum(Roles)
  role: Roles;
}
