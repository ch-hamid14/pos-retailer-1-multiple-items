import { Op, Sequelize } from 'sequelize';
import { IObject } from '../../common/constants';
import { ReceiptModel } from '../db/models';
import { ReceiptItemModel } from '../db/models/receiptItem';

class ReceiptService {
  async createReceipts(receiptData: any) {
    const receipt: any = await ReceiptModel.create({
      FBR_InvoiceNumber: receiptData.FBR_InvoiceNumber,
      POSID: receiptData.POSID,
      DateTime: receiptData.DateTime,
      BuyerName: receiptData.BuyerName,
      BuyerPhoneNumber: receiptData.BuyerPhoneNumber,
      BuyerNTN: receiptData.BuyerNTN,
      BuyerCNIC: receiptData.BuyerCNIC,
      PaymentMode: receiptData.PaymentMode,
      InvoiceType: receiptData.InvoiceType,
      TotalSaleValue: receiptData.TotalSaleValue,
      TotalTaxCharged: receiptData.TotalTaxCharged,
      TotalBillAmount: receiptData.TotalBillAmount,
      TotalQuantity: receiptData.TotalQuantity,
      Discount: receiptData.Discount,
      FurtherTax: receiptData.FurtherTax,
    });
    // Step 2: Insert items (linked to this receipt)
    if (receiptData.Items && receiptData.Items.length > 0) {
      const itemPayloads = receiptData.Items.map((item: any) => ({
        receiptId: receipt.id, // 👈 link to parent
        Item_UOM: item.UOM,
        Item_HSCode: item.HSCode,
        Item_SaleValue: item.SaleValue,
        Item_Inclusive: item.InclusiveTax,
        Item_Name: item.ItemName,
        Item_Price: item.Price,
        Item_Quantity: item.Quantity,
        Item_FbrPosFee: item.FbrPosFee,
        Item_TotalAmount: item.TotalAmount,
        Item_TaxCharged: item.TaxCharged,
        Item_TaxRate: item.TaxRate,
        Item_Discount: item.Discount,
      }));
      await ReceiptItemModel.bulkCreate(itemPayloads);
    }
    return receipt;
  }
  //get all credits
  async getAllReceipts(where: IObject = {}) {
    const { limit, offset, search } = where;
    delete where.limit;
    delete where.offset;
    delete where.search;
    const whereArr = [];
    Object.keys(where).forEach((key) => {
      whereArr.push({ [key]: where[key] });
    });
    if (search) {
      whereArr.push({
        [Op.or]: [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('FBR_InvoiceNumber')),
            {
              [Op.like]: `%${search.toLowerCase()}%`,
            },
          ),
        ],
      });
    }
    const queryOptions: any = {
      where: whereArr.length > 0 ? { [Op.and]: whereArr } : undefined,
      order: [['id', 'desc']],
      include: [{ model: ReceiptItemModel, as: 'items' }],
    };
    if (typeof limit !== 'undefined') queryOptions.limit = limit;
    if (typeof offset !== 'undefined') queryOptions.offset = offset;
    const data = await ReceiptModel.findAndCountAll(queryOptions);
    const resData = data.rows.map((el) => el.dataValues);

    return { total: data.count, data: resData };
  }

  async getReceiptsById(id: number) {
    const res = await ReceiptModel.findByPk(id);
    if (!res) {
      throw Error('Invalid receipt Id!');
    }
    return res.dataValues;
  }
}

export const receiptService = new ReceiptService();
