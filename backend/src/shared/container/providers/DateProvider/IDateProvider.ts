/* eslint-disable no-undef */
interface IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  formatDateToUTC(date: string): Date;

  dateNow(): Date;
  compareInDays(start_date: Date, end_date: Date): number;
  addDays(days: number): Date;
  arrayDates(startDate: Date, end_date: Date): string[];
  arrayDatesBD(startDate: Date, end_date: Date): string[];

  quantityDays(startDate: Date, end_date: Date): number;

  checkDateAvaileble(arrayUser: string[], arrayBD: any): boolean;
}

export { IDateProvider };
