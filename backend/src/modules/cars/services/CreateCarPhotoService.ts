import { inject, injectable } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

import { Photo } from '../infra/typeorm/entities/Photo';
import { ICarsRepository } from '../repositories/ICarsRepository';
import { IPhotosRepository } from '../repositories/IPhotosRepository';

interface IRequest {
  car_id: string;
  photoFilename: string;
}

@injectable()
class CreateCarPhotoService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ car_id, photoFilename }: IRequest): Promise<Photo> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError('Car does not exists.', 401);
    }

    const filename = await this.storageProvider.saveFile(photoFilename);
    const photo = await this.photosRepository.create({
      car_id,
      photo: filename,
    });

    return photo;
  }
}

export { CreateCarPhotoService };
