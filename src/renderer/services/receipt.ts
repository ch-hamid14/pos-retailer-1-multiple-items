import { Channels } from '../../common/constants';
import { http } from './http';

export const getReceiptById = async (id: number) => {
  const payload = {
    params: { id },
  };
  return http.get(Channels.RECEIPTS_BY_ID, payload);
};

export const getAllReceipt = async (data: any) => {
  const reqData = {
    query: data,
  };
  return http.get(`${Channels.RECEIPTS}`, reqData);
};

export const createReceipt = async (body: any) => {
  return http.post(Channels.RECEIPTS, {
    body,
  });
};
