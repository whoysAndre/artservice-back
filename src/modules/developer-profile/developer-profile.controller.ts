import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { DeveloperProfileService } from './developer-profile.service';
import { CreateDeveloperProfileDto } from './dto/create-developer-profile.dto';
import { SearchDeveloperDto } from './dto/search-developer.dto';
import { UpdateDeveloperProfileDto } from './dto/update-developer-profile.dto';

@ApiTags('developer-profile')
@ApiBearerAuth('JWT')
@Controller('developer-profile')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeveloperProfileController {
  constructor(
    private readonly developerProfileService: DeveloperProfileService,
  ) {}

  @ApiOperation({
    summary: 'Search developer profiles',
    description: 'Paginated list with optional specialty filter. Requires CUSTOMER role.',
  })
  @Get()
  @RequireRoles(Roles.CUSTOMER)
  findAll(@Query() query: SearchDeveloperDto) {
    return this.developerProfileService.findAll(query);
  }

  @ApiOperation({
    summary: 'Create own developer profile',
    description: 'One profile per developer. Returns 409 if already exists.',
  })
  @Post()
  @RequireRoles(Roles.DEVELOPER)
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateDeveloperProfileDto,
  ) {
    return this.developerProfileService.create(user.sub, dto);
  }

  @ApiOperation({ summary: "Get own developer profile", description: 'Requires DEVELOPER role.' })
  @Get('me')
  @RequireRoles(Roles.DEVELOPER)
  findMe(@CurrentUser() user: JwtPayload) {
    return this.developerProfileService.findMe(user.sub);
  }

  @ApiOperation({ summary: 'Update own developer profile', description: 'All fields optional.' })
  @Patch('me')
  @RequireRoles(Roles.DEVELOPER)
  update(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateDeveloperProfileDto,
  ) {
    return this.developerProfileService.update(user.sub, dto);
  }

  @ApiOperation({ summary: 'Upload profile picture', description: 'Multipart form-data. Field name: `picture`.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { picture: { type: 'string', format: 'binary' } },
    },
  })
  @Patch('me/picture')
  @RequireRoles(Roles.DEVELOPER)
  @UseInterceptors(FileInterceptor('picture'))
  uploadPicture(@CurrentUser() user: JwtPayload, @UploadedFile() file: any) {
    return this.developerProfileService.uploadPicture(user.sub, file.buffer);
  }

  @ApiOperation({
    summary: 'Get developer profile by ID',
    description: 'Returns full profile including reviews and portfolio. Requires CUSTOMER role.',
  })
  @ApiParam({ name: 'id', description: 'Developer profile UUID' })
  @Get(':id')
  @RequireRoles(Roles.CUSTOMER)
  findById(@Param('id') id: string) {
    return this.developerProfileService.findById(id);
  }
}
