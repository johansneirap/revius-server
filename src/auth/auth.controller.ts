import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

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

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebook() {
    return HttpStatus.OK;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookCallback(@Req() req: Request, @Res() res: Response) {
    const { user } = req;

    //TODO: Register the user in the database
    // return user;
    res.cookie('revius-auth-user', JSON.stringify(user), {
      httpOnly: true,
      secure: true,
    });
    res.redirect('http://localhost:3000');
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  google() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const { user } = req;

    //TODO: Register the user in the database
    // return user;
    console.log(user);
    res.cookie('revius-auth-user', JSON.stringify(user), {
      httpOnly: true,
      secure: true,
    });
    res.redirect('http://localhost:3000');
  }
}
