interface ICreateRentalDTO {
  user_id: string;
  car_id: string;
  expected_return_date: Date;

  start_date: Date;
  status: string;
  total: number;
}

export { ICreateRentalDTO };
