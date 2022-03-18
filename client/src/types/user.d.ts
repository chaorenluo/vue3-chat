interface User {
  userId: string;
  userName: string;
  password: string;
  avatar: string;
  role?: string;
  tag?: string;
  createTime: number;
}
type pickUser = Pick<User, 'userName' | 'password'>;
