export default interface ICreateUserReflexTokenDTO {
  user_id: string;
  expires_date: Date;
  reflesh_token: string;
}
