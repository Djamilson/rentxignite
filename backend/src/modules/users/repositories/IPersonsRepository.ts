import IUpdatePersonDTO from '../dtos/IUpdatePersonDTO';
import Person from '../infra/typeorm/entities/Person';

export default interface IPersonsRepository {
  findById(id: string): Promise<Person | undefined>;
  create(data: IUpdatePersonDTO): Promise<Person>;
  save(person: Person): Promise<Person>;
  delete(id: string): Promise<void>;
}
