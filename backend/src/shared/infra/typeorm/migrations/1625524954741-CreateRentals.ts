import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRentals1625524954741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rentals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'start_date',
            type: 'varchar',
            default: 'now()',
          },
          {
            name: 'end_date',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expected_return_date',
            isNullable: true,
            type: 'timestamp with time zone',
          },

          {
            name: 'total',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'status',
            type: 'varchar',
          },

          {
            name: 'canceled_at',
            type: 'timestamp',
            isNullable: true,
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
    await queryRunner.dropTable('rentals');
  }
}
