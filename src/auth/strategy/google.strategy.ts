import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get('GOOGLE_ID'),
      clientSecret: config.get('GOOGLE_SECRET'),
      callbackURL: config.get('GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accesstoken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any, info?: any) => void,
  ) {
    const { name, emails } = profile;
    const user = {
      firstName: name.givenName,
      lastName: name.familyName,
      email: emails[0].value,
    };
    const payload = {
      user,
      accesstoken,
      refreshToken,
    };
    done(null, payload);
  }
}
