import { IServerRequest, PayloadValidator } from '../../common/constants';
import { receiptService } from '../services/receiptService';

class Receipt {
  async getAllReceipt(_: Electron.IpcMainInvokeEvent, req: IServerRequest) {
     const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 20;
        const skip = (page - 1) * pageSize;
        const search = req.query.search;
        return await receiptService.getAllReceipts({
            limit: pageSize,
            offset: skip,
            search,
        });
  }
  async createReceipt(_: Electron.IpcMainInvokeEvent, req: IServerRequest) {
    return await receiptService.createReceipts(req.body);
  }
  async getReceiptById(_: Electron.IpcMainInvokeEvent, req: IServerRequest) {
    PayloadValidator(['id'], req.params);
    const banks = await receiptService.getReceiptsById(req.params?.id);
    if (!banks) {
      throw Error('Invalid Id!');
    }
    return banks;
  }
}

export const receiptController = new Receipt();
