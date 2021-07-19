import City from '../infra/typeorm/entities/City';

export default interface IPaginatedCitiesDTO {
  data: City[];
  page: number;
  limit: number;
  totalCount: number;
}
