import { QueryInterface } from 'sequelize';
import { ReceiptSchema } from '../models';

const createReceipts = {
  up: async (queryInterface: QueryInterface, _: any) => {
    await queryInterface.createTable('receipts', ReceiptSchema);
  },
  down: async (_: QueryInterface) => {
    // await queryInterface.dropTable('receipts', BankSchema)
  },

  // up: async (
  //   queryInterface: QueryInterface,
  //   Sequelize: typeof import('sequelize'),
  // ) => {
  //   const tableDefinition = await queryInterface.describeTable('receipts');

  //   if (!tableDefinition['Item_Discount']) {
  //     await queryInterface.addColumn('receipts', 'Item_Discount', {
  //       type: Sequelize.FLOAT,
  //       allowNull: true,
  //       defaultValue: 0,
  //     });
  //   }
  // },

  // down: async (queryInterface: QueryInterface) => {
  //   await queryInterface.removeColumn('receipts', 'Item_Discount');
  // },
};

export default createReceipts;
