export interface IUserDto {
  id: string;
  username: string;
  password: string;
  email: string;
  canEnter: boolean;
  isAdmin: boolean;
  isIn: boolean;
}
