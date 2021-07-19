import { getRepository, Repository } from 'typeorm';

import { ICreatePhotoDTO } from '@modules/cars/dtos/ICreatePhotoDTO';
import { IPhotosRepository } from '@modules/cars/repositories/IPhotosRepository';

import { Photo } from '../entities/Photo';

class PhotosRepository implements IPhotosRepository {
  private repository: Repository<Photo>;

  constructor() {
    this.repository = getRepository(Photo);
  }

  async findById(id: string): Promise<Photo | undefined> {
    const category = await this.repository.findOne(id);

    return category;
  }

  async listAll(): Promise<Photo[]> {
    const Photos = await this.repository.find();
    return Photos;
  }

  public async create(category: ICreatePhotoDTO): Promise<Photo> {
    const newPhoto = this.repository.create(category);

    await this.repository.save(newPhoto);

    return newPhoto;
  }

  public async save(category: Photo): Promise<Photo> {
    return this.repository.save(category);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { PhotosRepository };
