import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  const mockUser = {
    email: 'email@hotmail.com',
    password: 'password',
    firstName: 'firstName',
    phone: '+201000000000',
    dob: '2023-12-12',
    lastName: 'lastName',
    userName: 'userName',
    gender: 'MALE',
  } as User;
  beforeEach(async () => {
    const users: User[] = [];

    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },

      create: (partial: Partial<User>) => {
        const user = Object.create(partial);
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const password = mockUser.password;
    const user = await service.signup(mockUser);
    expect(user.password).not.toEqual(password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup(mockUser);
    await expect(service.signup(mockUser)).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin(mockUser.email, mockUser.password),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup(mockUser);
    await expect(
      service.signin(mockUser.email, mockUser.password),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    const password = mockUser.password;
    await service.signup(mockUser);
    const user = await service.signin(mockUser.email, password);
    expect(user).toBeDefined();
  });
});
