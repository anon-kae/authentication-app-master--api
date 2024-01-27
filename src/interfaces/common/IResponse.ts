export interface IResponseSuccess {
  status: 'SUCCESS';
  result: { [key: string]: any };
}

export interface IResponseFailed {
  status: 'ERROR';
  result: {
    code: null | string;
    type: string;
    message: string;
  };
}
