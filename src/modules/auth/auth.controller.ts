import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiExcludeEndpoint, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Initiate Google OAuth2 login',
    description:
      'Open this URL in a browser. After Google login the callback returns `{ token }` — copy it and use it in the Authorize button above.',
  })
  @Get('google')
  @UseGuards(AuthGuard('oauth2'))
  googleAuth() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('oauth2'))
  googleCallback(@Req() req) {
    return this.authService.generateJwt(req.user);
  }
}
