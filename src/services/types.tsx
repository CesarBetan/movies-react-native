interface dataHandlerError {
  data: string;
  status: string;
}
interface dataHandlerSuccess {
  data: string;
}

export interface IHandlerError {
  message: string;
  data: any;
  response: dataHandlerError;
}

export interface IHandlerSuccess {
  data: dataHandlerSuccess;
  status: number;
}
