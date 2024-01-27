export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    bio: string;
    phone: string;
    email: string;
    avatar: string;
    roles: string[] | [];
  };
  accessToken: string;
  refreshToken: string;
};

export default interface ILoginUseCase {
  validate(request: LoginRequest): Promise<LoginRequest>;
  execute(request: LoginRequest): Promise<LoginResponse>;
}
