import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@ApiBearerAuth('JWT')
@Controller('reviews')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Submit a review',
    description: 'One review per customer per developer. Returns 409 if duplicate.',
  })
  @ApiParam({ name: 'developerProfileId', description: 'Developer profile UUID' })
  @Post(':developerProfileId')
  @RequireRoles(Roles.CUSTOMER)
  create(
    @Param('developerProfileId') developerProfileId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.sub, developerProfileId, dto);
  }

  @ApiOperation({ summary: 'Get reviews for a developer profile' })
  @ApiParam({ name: 'developerProfileId', description: 'Developer profile UUID' })
  @Get(':developerProfileId')
  findByProfile(@Param('developerProfileId') developerProfileId: string) {
    return this.reviewsService.findByProfile(developerProfileId);
  }
}
