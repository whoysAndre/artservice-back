import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'List all users', description: 'Requires DEVELOPER role.' })
  @Get()
  @RequireRoles(Roles.DEVELOPER)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Update own role', description: 'Returns a fresh JWT with the new role.' })
  @ApiOkResponse({ schema: { example: { token: '<new-jwt>' } } })
  @Patch('me/role')
  async updateRole(
    @CurrentUser() user: JwtPayload,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const updated = await this.usersService.updateRole(user.sub, updateRoleDto.role);
    const payload: JwtPayload = {
      sub: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    };
    return { token: this.jwtService.sign(payload) };
  }
}
