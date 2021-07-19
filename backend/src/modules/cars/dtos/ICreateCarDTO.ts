import { Specification } from '@modules/specifications/infra/typeorm/entities/Specification';

interface ICreateCarDTO {
  name: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;

  about: string;
  period: string;
  available: boolean;
  price: number;
  fuel_type: string;

  category_id: string;
  specifications: Specification[];
  id?: string;
}

export { ICreateCarDTO };
