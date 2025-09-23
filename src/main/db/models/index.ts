import { DataTypes } from 'sequelize';
import { sequelize } from '../index';

// Schemas
const ReceiptSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  POSID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  USIN: {
    type: DataTypes.STRING,
  },
  DateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  BuyerName: DataTypes.STRING,
  BuyerPhoneNumber: DataTypes.STRING,
  BuyerNTN: DataTypes.STRING,
  PaymentMode: DataTypes.STRING,
  InvoiceType: DataTypes.STRING,
  RefUSIN: DataTypes.STRING,
  FBR_InvoiceNumber: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

// Models
const ReceiptModel = sequelize.define('receipt', ReceiptSchema, {
  timestamps: true,
});

export { ReceiptModel, ReceiptSchema };
