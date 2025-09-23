// models/ReceiptItem.ts
import { DataTypes } from 'sequelize';
import { sequelize } from '../index';
import { ReceiptModel } from './index';

export const ReceiptItemSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  receiptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'receipts',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  // Item fields
  Item_UOM: DataTypes.STRING,
  Item_HSCode: DataTypes.STRING,
  Item_SaleValue: DataTypes.FLOAT,
  Item_Inclusive: DataTypes.BOOLEAN,
  Item_Name: DataTypes.STRING,
  Items_SaleTax: DataTypes.FLOAT,
  Item_Price: DataTypes.FLOAT,
  Item_TaxRate: DataTypes.FLOAT,
  Item_Quantity: DataTypes.FLOAT,
  Item_FbrPosFee: DataTypes.FLOAT,
  Item_TotalAmount: DataTypes.FLOAT,
  Item_TaxCharged: DataTypes.FLOAT,
  Item_Discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
};

const ReceiptItemModel = sequelize.define('receipt_item', ReceiptItemSchema, {
  timestamps: true,
});

// Associations
ReceiptModel.hasMany(ReceiptItemModel, {
  foreignKey: 'receiptId',
  as: 'items',
});
ReceiptItemModel.belongsTo(ReceiptModel, {
  foreignKey: 'receiptId',
  as: 'receipt',
});

export { ReceiptItemModel };
