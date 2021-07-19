import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IGroupsRepository from '../repositories/IGroupsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

interface IResponserUser {
  id: string;
  is_verified: boolean;
  roles: string[];
  firstName: string;
  company: {
    id?: string;
    commercial_name?: string;
    stripe_id?: string;
  };
  person: {
    phone_id_main?: string;
    address_id_main?: string;
    id: string;
    name: string;
    email: string;
    status: boolean;
    privacy: boolean;
    avatar?: string;
    avatar_url?: () => string | null;
  };
}

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) {}

  public async execute({
    user_id,
  }: IRequest): Promise<IResponserUser | undefined> {
    const user = await this.usersRepository.findByIdInfoUser(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const groups = user.user_groups.map(group => {
      return { id: group.group_id };
    });

    const listgroup = await this.groupsRepository.findAllById(groups);

    const roles = listgroup?.map(role => {
      return role.description;
    });

    const meContract = user.userCompany?.company?.contracts.find(
      contract => contract.canceled_at === null,
    );

    const userSerealizable = {
      id: user.id,
      is_verified: user.is_verified,
      roles,
      firstName: user.person.name.split(' ')[0],
      company: {
        id: user.userCompany?.company.id,
        commercial_name: user.userCompany?.company.commercial_name,
        stripe_id: user.userCompany?.company?.contract?.plan.stripe_id,
        contract_active: !!meContract,
      },
      person: {
        id: user.person.id,
        name: user.person.name,
        email: user.person.email,
        status: user.person.status,
        privacy: user.person.privacy,
        avatar: user.person.avatar,
        phone_id_main: user.person.phone_id_main,
        address_id_main: user.person.address_id_main,
        avatar_url: user.person.getAvatarUrl,
      },
    };

    return userSerealizable;
  }
}

export default ShowUserService;
