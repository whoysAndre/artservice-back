import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthUser(profile: Profile) {
    const { id, emails, displayName, photos } = profile;
    const email = emails![0].value;
    const picture = photos?.[0]?.value;

    return this.usersService.findOrCreate({
      googleId: id,
      email,
      name: displayName,
      picture,
    });
  }

  generateJwt(user: { id: string; email: string; name: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return { token: this.jwtService.sign(payload) };
  }
}
