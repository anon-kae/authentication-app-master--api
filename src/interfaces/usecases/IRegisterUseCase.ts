export type RegisterRequest = {
  name: string;
  bio: string;
  phone: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export default interface IRegisterUseCase {
  validate(request: RegisterRequest): Promise<RegisterRequest>;
  execute(request: RegisterRequest): Promise<RegisterResponse>;
}
