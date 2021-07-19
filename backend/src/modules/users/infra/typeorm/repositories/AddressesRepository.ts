import { getRepository, Repository } from 'typeorm';

import ICreateAddressDTO from '@modules/users/dtos/ICreateAddressDTO';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';

import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormAddressRepository: Repository<Address>;

  constructor() {
    this.ormAddressRepository = getRepository(Address);
  }

  public async findAllAddressesToPerson(
    person_id: string,
  ): Promise<Address[] | undefined> {
    const addresses = this.ormAddressRepository.find({
      where: { person_id },
      relations: ['city', 'city.state'],
    });

    return addresses;
  }

  public async findById(id: string): Promise<Address | undefined> {
    const address = await this.ormAddressRepository.findOne(id, {
      relations: ['city', 'city.state'],
    });

    return address;
  }

  public async findByAddress(
    data: ICreateAddressDTO,
  ): Promise<Address | undefined> {
    const address = await this.ormAddressRepository.findOne({
      where: { ...data },
    });

    return address;
  }

  public async create(address: ICreateAddressDTO): Promise<Address> {
    const newAddress = await this.ormAddressRepository.create(address);

    await this.ormAddressRepository.save(newAddress);

    return newAddress;
  }

  public async save(address: Address): Promise<Address> {
    return this.ormAddressRepository.save(address);
  }

  public async delete(id: string): Promise<void> {
    await this.ormAddressRepository.delete(id);
  }
}

export default AddressesRepository;
