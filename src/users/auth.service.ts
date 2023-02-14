import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './users.entity';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(attrs: Partial<User>) {
    // See if email in use
    const users = await this.usersService.find(attrs.email);
    if (users.length) {
      throw new BadRequestException('email is in use');
    }
    // valid gender?
    attrs.gender = attrs.gender.toLowerCase();
    if (!new Set(['male', 'female']).has(attrs.gender)) {
      throw new BadRequestException("gender must be 'male' or 'female'");
    }
    // Hash user Password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password
    const hash = (await scrypt(attrs.password, salt, 32)) as Buffer;
    // join the hashed result and the salt together
    attrs.password = salt + '.' + hash.toString('hex');
    // create a new user and save it
    const user = await this.usersService.create(attrs);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User Not Found ');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    if (attrs.email) {
      const [user] = await this.usersService.find(attrs.email);
      if (user && user.id != id) {
        throw new BadRequestException('Email is in use');
      }
    }
    // valid gender?
    if (attrs.gender) {
      attrs.gender = attrs.gender.toLowerCase();
      if (!new Set(['male', 'female']).has(attrs.gender)) {
        throw new BadRequestException("gender must be 'male' or 'female'");
      }
    }
    return this.usersService.update(id, attrs);
  }
}
