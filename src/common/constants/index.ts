export enum Channels {
  RECEIPTS = 'receipts',
  RECEIPTS_BY_ID = 'receipts-by-id',
}
export type IObject = {
  [key: string | number]: any;
};
export type IServerRequest = {
  params: IObject;
  query: IObject;
  body: IObject;
};

export type IServerResponse = {
  data: null | any;
  error: {
    message: string;
    error: null | any;
  } | null;
};

export type IRequest = {
  params?: IObject;
  query?: IObject;
  body?: IObject;
};

export const PayloadValidator = (payload: string[], data: IObject) => {
  payload.map((el) => {
    if (!data[el]) {
      throw Error(`${el} is required!`);
    }
  });
};

export const LISTENERS = {
  PRINT: 'print',
  A4RECEIPT_DOWNLOAD: 'download-receipt-as-pdf',
};
