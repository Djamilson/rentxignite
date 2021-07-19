import City from '../infra/typeorm/entities/City';

export default interface ITotalCityDTO {
  result: City[];
  total: number;
}
