import { ipcMain } from 'electron';
import { Channels } from '../../common/constants';
import { catchIpcHandler } from './handler';
import { receiptController } from '../controllers/receipt';

//get user route
ipcMain.handle(
  `GET:${Channels.RECEIPTS}`,
  catchIpcHandler(receiptController.getAllReceipt),
);

//transactions
ipcMain.handle(
  `GET:${Channels.RECEIPTS_BY_ID}`,
  catchIpcHandler(receiptController.getReceiptById),
);
ipcMain.handle(
  `POST:${Channels.RECEIPTS}`,
  catchIpcHandler(receiptController.createReceipt),
);
