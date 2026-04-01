import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequireRoles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ContactService } from './contact.service';
import { ContactDeveloperDto } from './dto/contact-developer.dto';

@ApiTags('contact')
@ApiBearerAuth('JWT')
@Controller('contact')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@RequireRoles(Roles.CUSTOMER)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({
    summary: 'Contact a developer by email',
    description: 'Sends an email to the developer via Resend. Requires CUSTOMER role.',
  })
  @ApiParam({ name: 'developerProfileId', description: 'Developer profile UUID' })
  @Post(':developerProfileId')
  contact(
    @Param('developerProfileId') developerProfileId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: ContactDeveloperDto,
  ) {
    return this.contactService.contactDeveloper(developerProfileId, user, dto);
  }
}
