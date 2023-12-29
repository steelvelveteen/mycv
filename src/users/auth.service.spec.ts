import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    // Create a fake copy of usersService
    fakeUsersService = {
      // find: () => Promise.resolve([]),
      find: (email: string) => {
        const filteredUsers = users.filter((u) => u.email === email);
        return Promise.resolve(filteredUsers);
      },
      // create: (email: string, password: string) =>
      //   Promise.resolve({ id: 1, email, password } as User),
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Setup the test module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create new user with a salted and hashed password', async () => {
    const user = await service.register('noelia.serrano@gmail.com', 'pa$$w0rd');
    expect(user.password).not.toEqual('pa$$w0rd');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw error if user registers with email in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ email: 'fake@fake.com', password: 'fake$$' } as User]);

    await service.register('fake@fake.com', 'fake$$');
    await expect(service.register('fake@fake.com', 'fake$$')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw error if user logs in with unused email', async () => {
    await expect(service.login('unused@fake', 'fake$$')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw error if invalid password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ email: 'fake@fake.com', password: 'fake$$' } as User]);
    await service.register('fake@fake.com', 'fake$$');
    await expect(service.login('fake@fake.com', 'invalid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'fake@fake.com',
    //       password:
    //         'b1a9a6579bb84ad1.f4bc9dea9cecc971a2baf592e9c2bef2bf3b72c229b63197d61d117b3fa505bf',
    //     } as User,
    //   ]);

    await service.register('fake@fake.com', 'fake$$');
    const user = await service.login('fake@fake.com', 'fake$$');

    expect(user).toBeDefined();
  });
});
