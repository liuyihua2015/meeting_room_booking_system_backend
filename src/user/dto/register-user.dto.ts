import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  //添加验证
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({
    description: '用户名',
  })
  username: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  @ApiProperty({
    description: '昵称',
  })
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  @ApiProperty({
    description: '密码',
    minLength: 6,
  })
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  @ApiProperty({
    description: '邮箱',
  })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty({
    description: '验证码',
  })
  captcha: string;
}
