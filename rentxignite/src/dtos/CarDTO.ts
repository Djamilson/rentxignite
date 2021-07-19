export interface Specification {
  id: string;
  type: string;
  name: string;
}

export interface Photo {
  id: string;
  photo: string;
  photo_url: string;
}

export interface CarDTO {
  id: string;
  brand: string;
  name: string;
  about: string;

  period: string;
  price: number;

  fuel_type: string;
  photo: Photo;
  specifications: Specification[];
  photos: { id: string; photo: string }[];
}
