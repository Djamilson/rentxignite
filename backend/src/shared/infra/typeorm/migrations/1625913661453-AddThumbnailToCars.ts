import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddThumbnailToCars1625913661453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cars',
      new TableColumn({
        name: 'photo_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'cars',
      new TableForeignKey({
        name: 'PhotoCars',
        columnNames: ['photo_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'photos',
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('cars', 'PhotoCars');

    await queryRunner.dropColumn('cars', 'photo_id');
  }
}
