import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarFilderToPersons1598362558325
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'persons',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('persons', 'avatar');
  }
}
