import { MigrationInterface, QueryRunner } from 'typeorm';

import {
  cities,
  person,
  user,
  usersGroups,
  states,
  groups,
  specifications,
} from '../dataDefault';

export class InitialDate1625604690172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert data static
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('groups')
      .values(groups)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('states')
      .values(states)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('persons')
      .values(person)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values(user)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users_groups')
      .values(usersGroups)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('cities')
      .values(cities)
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('specifications')
      .values(specifications)
      .execute();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
