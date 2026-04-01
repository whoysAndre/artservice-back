import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
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
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('portfolio')
@ApiBearerAuth('JWT')
@Controller('portfolio')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@RequireRoles(Roles.DEVELOPER)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @ApiOperation({
    summary: 'Add a portfolio project',
    description: 'Multipart form-data. Image field is optional.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: { type: 'string', example: 'E-commerce platform' },
        description: { type: 'string', example: 'Built with Next.js and Stripe.' },
        projectUrl: { type: 'string', example: 'https://myproject.com' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePortfolioProjectDto,
    @UploadedFile() file?: any,
  ) {
    return this.portfolioService.create(user.sub, dto, file?.buffer);
  }

  @ApiOperation({ summary: 'Delete a portfolio project' })
  @ApiParam({ name: 'id', description: 'Portfolio project UUID' })
  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.portfolioService.remove(user.sub, id);
  }
}
