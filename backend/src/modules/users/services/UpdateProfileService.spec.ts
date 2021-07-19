import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '1234477',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jdmiaon tre',
      email: 'djamilson@gmail.com.tre',
    });

    expect(updateUser.name).toBe('Jdmiaon tre');
    expect(updateUser.email).toBe('djamilson@gmail.com.tre');
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '1234477',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste te',
      email: 'teste@bol.com.br',
      password: '1234477',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Djamisl ioo',
        email: 'djoo@bol.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '123447',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jdmiaon for',
      email: 'djamilson@gmail.com.tre',
      old_password: '123447',
      password: '121212',
    });

    expect(updateUser.password).toBe('121212');
  });

  it('should not be able to update the password whithout old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '123447',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jdmiaon for',
        email: 'djamilson@gmail.com.tre',
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password whit wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Djamisl ioo',
      email: 'djoo@bol.com.br',
      password: '123447',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Jdmiaon for',
        email: 'djamilson@gmail.com.tre',
        old_password: 'wrong-old-password',
        password: '121212',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
