import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'fake@fake.com',
          password: 'fake$$',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'random$$' } as User,
        ]);
      },
      // remove: (id: number) => {},
      // update: () => {},
    };

    fakeAuthService = {
      // register: () => {},
      login: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    // Setup the test module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of users with matching email', async () => {
    const users = await controller.findAllUsers('fake@fake.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('fake@fake.com');
  });

  it('should return single user by provided id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('should throw error if user by id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('333')).rejects.toThrow(NotFoundException);
  });

  it('should update session and return use upon login', async () => {
    const session = { userId: -10 };
    const user = await controller.login(
      { email: 'fake@fake.com', password: 'fake$$' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
