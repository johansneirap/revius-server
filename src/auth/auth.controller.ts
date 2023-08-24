import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Request, Response } from 'express';
import axios from 'axios';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Post('oauth/google')
  async googleOauth(@Req() req: Request, @Res() res: Response) {
    const { user } = req.body;
    const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${user.accessToken}`;
    const { data } = await axios.get(url);
    console.log(user, 'USER');
    console.log(data, 'RESPONSE FROM GOOGLE');
    //TODO: Register OR update the user in the database
    if (data.sub !== user.id)
      return res.status(401).json({ message: 'Unauthorized' });

    const token = await this.authService.signToken(user.id, user.email);
    res.json(token);
  }

  @Post('oauth/facebook')
  async facebookOauth(@Req() req: Request, @Res() res: Response) {
    const { user } = req.body;
    const url = `https://graph.facebook.com/me?access_token=${user.accessToken}`;
    const { data } = await axios.get(url);
    console.log(user, 'USER');
    console.log(data, 'RESPONSE FROM FACEBOOK');
    //TODO: Register OR update the user in the database
    if (data.id !== user.id)
      return res.status(401).json({ message: 'Unauthorized' });

    const token = await this.authService.signToken(user.id, user.email);
    res.json(token);
  }
}
