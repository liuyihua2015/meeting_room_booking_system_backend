import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);

    const { access_token, refresh_token } = await this.generateTokens(
      vo.userInfo,
    );

    vo.accessToken = access_token;

    vo.refreshToken = refresh_token;

    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);

    const { access_token, refresh_token } = await this.generateTokens(
      vo.userInfo,
    );

    vo.accessToken = access_token;

    vo.refreshToken = refresh_token;

    return vo;
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      const { access_token, refresh_token } = await this.generateTokens(user);

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      const { access_token, refresh_token } = await this.generateTokens(user);

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  /**
   * 生成访问令牌和刷新令牌
   *
   * @param userInfo 用户信息对象
   * @returns 包含accessToken和refreshToken的对象
   */
  async generateTokens(
    userInfo: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessTokenPayload = {
      userId: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles,
      permissions: userInfo.permissions,
    };

    const refreshTokenPayload = {
      userId: userInfo.id,
    };

    const access_token = this.jwtService.sign(accessTokenPayload, {
      expiresIn:
        this.configService.get('jwt_access_token_expires_time') || '30m',
    });

    const refresh_token = this.jwtService.sign(refreshTokenPayload, {
      expiresIn:
        this.configService.get('jwt_refresh_token_expires_time') || '7d', // 注意这里修正了可能的拼写错误：expres_time -> expires_time
    });

    return { access_token, refresh_token };
  }
}
