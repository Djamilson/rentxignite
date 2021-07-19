import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPersonsRepository from '../repositories/IPersonsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  driver_license: string;
  avatar: string;
}

interface IUser {
  user_id: string;
  person_id: string;
  person_name: string;
  person_email: string;
  person_status: boolean;
  person_privacy: boolean;
  person_avatar: string;
  person_avatar_url: string | null;
  person_driver_license: string;
}
@injectable()
class SyncPullUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PersonsRepository')
    private personsRepository: IPersonsRepository,
  ) {}

  public async execute({
    user_id,
    name,
    driver_license,
    avatar,
  }: IRequest): Promise<IUser> {
    let user = await this.usersRepository.findById(user_id);
    let test = false;

    console.log('=>>> meu Deus ==>>', user_id, name, driver_license, avatar);

    if (!user) {
      throw new AppError('User not found');
    }

    if (user.person.name !== name) {
      user.person.name = name;
      test = true;
    }

    if (user.person.driver_license !== driver_license) {
      user.person.driver_license = driver_license;
      test = true;
    }

    if (user.person.driver_license !== driver_license) {
      user.person.avatar = avatar;
      test = true;
    }

    if (test) {
      await this.personsRepository.save(user.person);
      user = await this.usersRepository.findById(user_id);

      if (!user) {
        throw new AppError('User not found');
      }
    }

    return {
      user_id: user.id,
      person_id: user.person.id,
      person_name: user.person.name,
      person_email: user.person.email,
      person_status: user.person.status,
      person_privacy: user.person.privacy,
      person_avatar: user.person.avatar,
      person_avatar_url: user.person.getAvatarUrl(),
      person_driver_license: user.person.driver_license,
    };
  }
}

export { SyncPullUsersService };
