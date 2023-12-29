import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(email: string, password: string) {
    // Verify email is in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // Hash user password

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Joind the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');

    // Create user and save it
    const user = this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async login(email: string, password: string) {
    // Verify user exists
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException("Email doesn't exist");
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }

    // User password matches
    return user;
  }
}
