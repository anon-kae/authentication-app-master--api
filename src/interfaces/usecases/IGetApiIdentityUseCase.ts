export type GetApiIdentityRequest = {};
export type GetApiIdentityResponse = {
  message: string;
};

export default interface IGetApiIdentityUseCase {
  validate(request: GetApiIdentityRequest): Promise<GetApiIdentityRequest>;
  execute(request: GetApiIdentityRequest): Promise<GetApiIdentityResponse>;
}
