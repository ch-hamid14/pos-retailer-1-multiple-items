import { QueryInterface } from 'sequelize';
import { ReceiptItemSchema } from '../models/receiptItem';

const CreateReceiptItem = {
  up: async (queryInterface: QueryInterface, _: any) => {
    await queryInterface.createTable('receipt_items', ReceiptItemSchema);
  },
  down: async (_: QueryInterface) => {
    // await queryInterface.dropTable('receipts', BankSchema)
  },
};

export default CreateReceiptItem;
