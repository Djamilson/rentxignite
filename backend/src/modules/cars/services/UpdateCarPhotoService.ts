import { inject, injectable } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

import { Photo } from '../infra/typeorm/entities/Photo';
import { IPhotosRepository } from '../repositories/IPhotosRepository';

interface IRequest {
  photo_id: string;
  photoFilename: string;
}

@injectable()
class UpdateCarPhotoService {
  constructor(
    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ photo_id, photoFilename }: IRequest): Promise<Photo> {
    const existsPhoto = await this.photosRepository.findById(photo_id);

    if (!existsPhoto) {
      throw new AppError('Photo does not exists.', 401);
    }

    if (existsPhoto && existsPhoto.photo) {
      await this.storageProvider.deleteFile(existsPhoto.photo);
    }

    const filename = await this.storageProvider.saveFile(photoFilename);

    existsPhoto.photo = filename;

    return this.photosRepository.create(existsPhoto);
  }
}

export { UpdateCarPhotoService };
