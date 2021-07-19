import ICreateAddressDTO from '../dtos/ICreateAddressDTO';
import Address from '../infra/typeorm/entities/Address';

export default interface IAddressesRepository {
  findAllAddressesToPerson(id: string): Promise<Address[] | undefined>;
  findByAddress(data: ICreateAddressDTO): Promise<Address | undefined>;
  findById(id: string): Promise<Address | undefined>;
  create(data: ICreateAddressDTO): Promise<Address>;
  save(address: Address): Promise<Address>;
  delete(id: string): Promise<void>;
}
