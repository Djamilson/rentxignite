import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Dja jldjlaj',
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    const res = await authenticateUser.execute({
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    expect(res).toHaveProperty('token');
    expect(res.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'djoo@bol.com.br',
        password: '12344',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with password', async () => {
    await fakeUsersRepository.create({
      name: 'Dja jldjlaj',
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    await expect(
      authenticateUser.execute({
        email: 'djoo@bol.com.br',
        password: '912344',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
