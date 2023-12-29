import { IsEmail, IsString } from 'class-validator';

/**
 * @description CreateUserDto used when a user registers
 * or logs in
 * @param email
 * @param password
 */
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
