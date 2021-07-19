import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

// import { CarsRepository } from '@modules/cars/infra/typeorm/repositories/CarsRepository';
// import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { CarsRepository } from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import { PhotosRepository } from '@modules/cars/infra/typeorm/repositories/PhotosRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { IPhotosRepository } from '@modules/cars/repositories/IPhotosRepository';
import { CategoriesRepository } from '@modules/categories/infra/typeorm/repositories/CategoriesRepository';
import { ICategoriesRepository } from '@modules/categories/repositories/ICategoriesRepository';
import CitiesRepository from '@modules/locality/infra/typeorm/repositories/CitiesRepository';
import StatesRepository from '@modules/locality/infra/typeorm/repositories/StatesRepository';
import ICitiesRepository from '@modules/locality/repositories/ICitiesRepository';
import IStatesRepository from '@modules/locality/repositories/IStatesRepository';
import RefreshesTokensRepository from '@modules/refreshesTokens/infra/typeorm/repositories/RefreshesTokensRepository';
import IRefreshesTokensRepository from '@modules/refreshesTokens/repositories/IRefreshesTokensRepository';
import { RentalsRepository } from '@modules/rentals/infra/typeorm/repositories/RentalsRepository';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { SpecificationsRepository } from '@modules/specifications/infra/typeorm/repositories/SpecificationsRepository';
import { ISpecificationsRepository } from '@modules/specifications/repositories/ISpecificationsRepository';
import AddressesRepository from '@modules/users/infra/typeorm/repositories/AddressesRepository';
import GroupsRepository from '@modules/users/infra/typeorm/repositories/GroupsRepository';
import PersonsRepository from '@modules/users/infra/typeorm/repositories/PersonsRepository';
import PhonesRepository from '@modules/users/infra/typeorm/repositories/PhonesRepository';
import UsersGroupsRepository from '@modules/users/infra/typeorm/repositories/UsersGroupsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import IGroupsRepository from '@modules/users/repositories/IGroupsRepository';
import IPersonsRepository from '@modules/users/repositories/IPersonsRepository';
import IPhonesRepository from '@modules/users/repositories/IPhonesRepository';
import IUsersGroupsRepository from '@modules/users/repositories/IUsersGroupsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import { IDateProvider } from './providers/DateProvider/IDateProvider';
import DayjsDateProvider from './providers/DateProvider/implementations/DayjsDateProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IPersonsRepository>(
  'PersonsRepository',
  PersonsRepository,
);

container.registerSingleton<IStatesRepository>(
  'StatesRepository',
  StatesRepository,
);
container.registerSingleton<ICitiesRepository>(
  'CitiesRepository',
  CitiesRepository,
);

container.registerSingleton<IPhonesRepository>(
  'PhonesRepository',
  PhonesRepository,
);

container.registerSingleton<IUsersGroupsRepository>(
  'UsersGroupsRepository',
  UsersGroupsRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IGroupsRepository>(
  'GroupsRepository',
  GroupsRepository,
);

container.registerSingleton<IRefreshesTokensRepository>(
  'RefreshesTokensRepository',
  RefreshesTokensRepository,
);

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DayjsDateProvider,
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<ISpecificationsRepository>(
  'SpecificationsRepository',
  SpecificationsRepository,
);

container.registerSingleton<ICarsRepository>('CarsRepository', CarsRepository);

container.registerSingleton<IPhotosRepository>(
  'PhotosRepository',
  PhotosRepository,
);

container.registerSingleton<IRentalsRepository>(
  'RentalsRepository',
  RentalsRepository,
);
