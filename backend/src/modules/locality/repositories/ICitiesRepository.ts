import ICityDTO from '../dtos/ICityDTO';
import ITotalCityDTO from '../dtos/ITotalCityDTO';
import City from '../infra/typeorm/entities/City';

export default interface IAddressesRepository {
  findByCitiesToStateId(object: ICityDTO): Promise<City[] | undefined>;
  findById(id: string): Promise<City | undefined>;
  findAndCount(object: ICityDTO): Promise<ITotalCityDTO>;
}
