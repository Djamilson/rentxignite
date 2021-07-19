export interface IRentalDTO {
  id: string;
  car_id: string;
  start_date: string;
  expected_return_date: string;
  status: string;
  total: number;

  car_name: string;
  car_brand: string;

  car_fuel_type: string;
  car_category_id: string;
  car_category_name: string;
  car_category_description: string;
  car_thumbnail: string;
  car_photo_url: string | null;

  start_date_formated: string;
  expected_return_date_formated: string;
}
