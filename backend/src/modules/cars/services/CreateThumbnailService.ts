import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

import { Photo } from '../infra/typeorm/entities/Photo';
import { ICarsRepository } from '../repositories/ICarsRepository';
import { IPhotosRepository } from '../repositories/IPhotosRepository';

interface IRequest {
  car_id: string;
  photoFilename?: string;
}

@injectable()
class CreateThumbnailService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('PhotosRepository')
    private photosRepository: IPhotosRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ car_id, photoFilename }: IRequest): Promise<Photo> {
    const car = await this.carsRepository.findById(car_id);

    if (!car) {
      throw new AppError('Car does not exists.', 401);
    }

    if (!photoFilename) {
      throw new AppError('PhotoFilename does not exists.', 402);
    }

    const filename = await this.storageProvider.saveFile(photoFilename);

    const thumbnail = await this.photosRepository.create({
      car_id,
      photo: filename,
    });

    car.photo = thumbnail;

    await this.carsRepository.save(car);

    const cachekey = `cars`;

    await this.cacheProvider.invalidatePrefix(cachekey);

    return thumbnail;
  }
}

export { CreateThumbnailService };
