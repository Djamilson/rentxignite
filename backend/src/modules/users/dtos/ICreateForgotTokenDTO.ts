export default interface ICreateForgotTokenDTO {
  user_id: string;
  token: string;
  code: string;
  expires_date: Date;
}
