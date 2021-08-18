import { parseISO, differenceInMilliseconds } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { Regulation } from '../infra/typeorm/entities/Regulation';
import { IRegulationsRepository } from '../repositories/IRegulationsRepository';

interface IRes {
  id: string;
  updated_at_: string;
}
interface IRequest {
  regulations: IRes[];
}

interface IResRegulation {
  id: string;
  regulation: string;
  reading_time: number;
  created_at: Date;
  updated_at_: Date;
}

interface IResponseData {
  created: IResRegulation[] | [];
  updated: IResRegulation[] | [];
  deleted: [];
}

function regulationX(regulation: Regulation): IResRegulation {
  return {
    id: regulation.id,
    reading_time: regulation.reading_time,
    regulation: regulation.regulation,

    created_at: regulation.created_at,
    updated_at_: regulation.updated_at,
  };
}
@injectable()
class SyncPullRegulationsService {
  constructor(
    @inject('RegulationsRepository')
    private regulationsRepository: IRegulationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ regulations }: IRequest): Promise<IResponseData> {
    let onlyNews = [] as IResRegulation[] | undefined;
    let onlyUpdated = [] as IResRegulation[] | undefined;

    let flagOnlyNews = [] as Regulation[] | undefined;
    let flagOnlyUpdated = [] as Regulation[] | undefined;
    let regulationsBD = [] as Regulation[] | undefined;

    const cachekey = `regulations`;

    let myCacheRegulations = await this.cacheProvider.recover<IResponseData>(
      cachekey,
    );

    //  if (myCacheRegulations === null) {
    regulationsBD = await this.regulationsRepository.findAll();

    if (regulations.length < 1) {
      flagOnlyNews = regulationsBD;
    } else {
      flagOnlyUpdated = regulationsBD?.filter(item => {
        const update = regulations?.find((regulationUse: IRes) => {
          if (
            item.id === regulationUse.id &&
            differenceInMilliseconds(
              item.updated_at,
              parseISO(regulationUse.updated_at_),
            ) !== 0
          ) {
            return item;
          }
        });

        if (update) return item;
      });

      flagOnlyNews = regulationsBD?.filter(item => {
        const existRegulation = regulations?.find(
          regulationUse => item.id === regulationUse.id,
        );

        if (!existRegulation) return item;
      });
    }

    onlyNews = flagOnlyNews?.map(regulation => regulationX(regulation));
    onlyUpdated = flagOnlyUpdated?.map(regulation => regulationX(regulation));

    await this.cacheProvider.save(cachekey, {
      created: onlyNews || [],
      updated: onlyUpdated || [],
      deleted: [],
    });

    myCacheRegulations = {
      created: onlyNews || [],
      updated: onlyUpdated || [],
      deleted: [],
    };
    //   }

    return myCacheRegulations;
  }
}

export { SyncPullRegulationsService };
