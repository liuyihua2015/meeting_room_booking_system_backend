import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RegisterUserDto } from './user/dto/RegisterUserDto';
// import { User } from './user/entities/user.entity';

@Injectable()
export class AppService {
  // private logger = new Logger();
  // @InjectRepository(User)
  // private userRepository: Repository<User>;
  // async register(user: RegisterUserDto) {
  //   const newUser = this.userRepository.create(user);
  //   this.logger.log('new user: ' + JSON.stringify(newUser));
  //   return await this.userRepository.save(newUser);
  // }
}
