import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-facebook';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get('FB_ID'),
      clientSecret: config.get('FB_SECRET'),
      callbackURL: config.get('FB_CALLBACK'),
      scope: ['email'],
      profileFields: ['emails', 'name'],
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
