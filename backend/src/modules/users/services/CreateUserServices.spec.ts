import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    const user = await createUser.execute({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user whith same email from another', async () => {
    await createUser.execute({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '12344',
    });

    await expect(
      createUser.execute({
        name: 'Djamisl ioo',
        email: 'djoo@bol.com.br',
        password: '12344',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
