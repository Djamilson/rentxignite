import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAddresses1598361488394
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses_persons',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'number',
            type: 'int',
          },
          {
            name: 'street',
            type: 'varchar',
          },

          {
            name: 'complement',
            type: 'varchar',
          },

          {
            name: 'zip_code',
            type: 'varchar',
          },

          {
            name: 'neighborhood',
            type: 'varchar',
          },

          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses_persons');
  }
}
