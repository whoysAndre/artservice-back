import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { envs } from 'src/config';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: envs.oauthClientId,
      clientSecret: envs.oauthClientSecret,
      callbackURL: envs.oauthCallbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return this.authService.validateOAuthUser(profile);
  }
}
