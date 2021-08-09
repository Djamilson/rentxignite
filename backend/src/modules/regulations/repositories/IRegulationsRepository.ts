import { ICreateRegulationDTO } from '../dtos/ICreateRegulationDTO';
import { Regulation } from '../infra/typeorm/entities/Regulation';

interface IRegulationsRepository {
  findById(id: string): Promise<Regulation | undefined>;
  findAll(): Promise<Regulation[] | undefined>;

  create(data: ICreateRegulationDTO): Promise<Regulation>;
  save(user: Regulation): Promise<Regulation>;
  delete(id: string): Promise<void>;
}

export { IRegulationsRepository };
