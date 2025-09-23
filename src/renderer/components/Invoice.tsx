import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Checkbox,
  message,
} from 'antd';
import axios from 'axios';
import '../index.css';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { receiptApi } from '../services';
import { unitOptions } from './units';
import { apiClient, credentials, payloadData } from '../utils/data';
import { TiTick } from 'react-icons/ti';
import ItemsPreview from './ItemsPreview';
import { CiSquarePlus } from 'react-icons/ci';
import useModal from 'antd/es/modal/useModal';

const { Option } = Select;

const Invoice = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const [modal, contexHolder] = useModal();
  const currentDateTime = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  const [options, setOptions] = useState([
    { value: 'Walking Customer', label: 'Walking Customer' },
  ]);

  // Tax & Calculation Section
  const price = Form.useWatch(['item', 'Price'], form) || 0;
  const quantity = Form.useWatch(['item', 'Quantity'], form) || 0;
  const inclusive = Form.useWatch(['item', 'Inclusive'], form);
  const taxRatePercent = Form.useWatch(['item', 'TaxRate'], form) || 0;
  const posFee = Form.useWatch('posFee', form) || 0;
  const printerName = localStorage.getItem('printerName');
  const discount = Form.useWatch(['item', 'discount'], form) || 0;
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const saleValue = price * quantity;
    const taxRate = taxRatePercent / 100;

    let netSale = saleValue;
    let taxCharged = 0;

    if (inclusive) {
      netSale = saleValue / (1 + taxRate);
      taxCharged = saleValue - netSale;
    } else {
      taxCharged = saleValue * taxRate;
      netSale = saleValue;
    }

    const totalAmount = netSale + taxCharged + posFee - discount;

    form.setFieldsValue({
      TotalSaleValue: Number(netSale.toFixed(2)),
      TotalTaxCharged: Number(taxCharged.toFixed(2)),
      TotalBillAmount: Number(totalAmount.toFixed(2)),
      item: {
        ...form.getFieldValue('item'),
        SaleValue: Number(netSale.toFixed(2)),
        TaxCharged: Number(taxCharged.toFixed(2)),
        TotalAmount: Number(totalAmount.toFixed(2)),
      },
    });
  }, [price, quantity, inclusive, taxRatePercent, posFee, discount, form]);

  const handleAddItem = async () => {
    const currentItem = await form.getFieldValue('item');
    if (!currentItem) {
      message.error('Please fill in item details before adding.');
      return;
    }

    // 🔹 Transform item into required payload structure
    // const valueSalesExcludingST = retailPrice
    //   ? retailPrice * currentItem.Quantity
    //   : currentItem.Price * currentItem.Quantity - discount;

    const transformedItem = {
      ItemCode: payloadData.ITEM_CODE,
      UOM: currentItem.uom,
      HSCode: currentItem?.hsCode,
      SaleValue: currentItem?.SaleValue || 0,
      InclusiveTax: currentItem?.Inclusive,
      ItemName: currentItem?.ItemName || '',
      Price: currentItem?.Price,
      Quantity: currentItem?.Quantity || 0,
      FbrPosFee: currentItem?.posFee || 1,
      PCTCode: payloadData.PCT_CODE,
      TotalAmount: currentItem?.TotalAmount || 0,
      TaxCharged: currentItem?.TaxCharged || 0,
      TaxRate: currentItem?.TaxRate,
      Discount: currentItem?.discount || 0,
      FurtherTax: currentItem?.FurtherTax || 0,
      InvoiceType: 1,
      RefUSIN: null,
      Item_Discount: currentItem?.discount,
    };

    setItems((prev) => [...prev, transformedItem]);

    // clear only item fields (keep buyer info intact)
    form.setFieldsValue({ item: {} });
    message.success('Item added to invoice!');
  };

  const onFinish = async (values: any) => {
    const isSubmit = await modal.confirm({
      title: 'Are you sure you want to submit the invoice?',
    });
    if (!isSubmit) return;
    setLoading(true);
    await form.validateFields();
    const localInvoiceNumber = `INV-${Date.now()}`;
    const item = values.item;
    const price = item.Price || 0;
    const quantity = item.Quantity || 0;
    const inclusive = item.Inclusive || false;
    const taxRatePercent = item.TaxRate || 0;
    const posFee = values.posFee || 0;

    const saleValue = price * quantity;
    const taxRate = taxRatePercent / 100;
    let netSale = saleValue;
    let taxCharged = 0;

    if (inclusive) {
      const net = saleValue / (1 + taxRate);
      taxCharged = saleValue - net;
      netSale = net;
    } else {
      taxCharged = saleValue * taxRate;
    }

    const totalAmount = netSale + taxCharged + posFee - discount;

    // Assign final calculated values
    values.TotalSaleValue = Number(netSale.toFixed(2));
    values.TotalTaxCharged = Number(taxCharged.toFixed(2));
    values.TotalBillAmount = Number(totalAmount.toFixed(2));

    item.SaleValue = Number(netSale.toFixed(2));
    item.TaxCharged = Number(taxCharged.toFixed(2));
    item.TotalAmount = Number(totalAmount.toFixed(2));
    item.FbrPosFee = posFee;

    // Step 1: Format FBR payload
    const payload = {
      InvoiceNumber: localInvoiceNumber,
      FBR_InvoiceNumber: '',
      POSID: payloadData.POS_ID,
      USIN: 0,
      RefUSIN: null,
      DateTime: currentDateTime,
      BuyerName: values.BuyerName || 'Walking Customer',
      BuyerPhoneNumber: values.BuyerPhoneNumber || '',
      BuyerNTN: values.BuyerNTN || '',
      BuyerCNIC: values.BuyerCNIC || '',
      PaymentMode: 1,
      InvoiceType: 1,
      TotalSaleValue: values.TotalSaleValue || 0,
      TotalTaxCharged: values.TotalTaxCharged || 0,
      TotalBillAmount: values.TotalBillAmount || 0,
      TotalQuantity: values.item?.Quantity || 0,
      Discount: values.item.discount || 0,
      FurtherTax: values.FurtherTax || 0,
      Items: items,
    };
    // Step 2: Call FBR API to get InvoiceNumber
    try {
      const response = await axios.post(apiClient.FBR_URL, payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
          'Content-Type': 'application/json',
        },
      });

      // // Step 3: Add InvoiceNumber to payload
      const FBR_InvoiceNumber = response?.data?.InvoiceNumber;
      if (!FBR_InvoiceNumber) {
        console.error('InvoiceNumber not received from FBR API');
        return;
      }
      payload.FBR_InvoiceNumber = FBR_InvoiceNumber;
      values.FBR_InvoiceNumber = FBR_InvoiceNumber;
      // Step 4: Store in local FBR_InvoiceNumber
      const dbRes = await receiptApi.createReceipt(payload);
      // const arr = getInvoicePrintArray(
      //   values.InvoiceNumber || localInvoiceNumber, // invNo
      //   values.BuyerName || 'Walking Customer', // customerName
      //   [
      //     [
      //       values.item.ItemName,
      //       values.item.Price,
      //       values.item.Quantity,
      //       values.item.discount ?? 0,
      //       values.item.TotalAmount,
      //     ],
      //   ], // data
      //   values.FBR_InvoiceNumber, // fbr invoiceNumber
      //   // dayjs(values.date).format('YYYY-MM-DD HH:mm:ss'), // date
      //   currentDateTime,
      //   values.TotalSaleValue, // subTotal
      //   values.TotalTaxCharged, // taxCharged
      //   values.posFee, // posFee
      //   values.item.discount,
      //   values.TotalBillAmount, // totalAmount
      //   values.item.hsCode || '',
      //   values.BuyerNTN || 'N/A',
      //   values.BuyerPhoneNumber || 'N/A',
      // );
      // window.electron.ipcRenderer.send(LISTENERS.PRINT, arr, printerName);
      message.success('Receipt generated successfully');
      setLoading(false);
      values.saleId = dbRes.data?.dataValues.id;
    } catch (error) {
      console.error(console.log('Error', error));
      message.error(`Error while generating receipt ${error}`);
      setLoading(false);
    }
  };

  const handleSearch = (val: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (val && !options.some((opt) => opt.value === val)) {
        setOptions([{ value: val, label: val }, ...options]);
      }
    }, 500);
  };

  return (
    <div className="invoice-wrapper">
      {contexHolder}
      {/* Left Form Section */}
      <div className="form-scroll">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            posFee: 1,
            // InvoiceType: 1,
            // PaymentMode: 1,
          }}
        >
          <h2 className="form-title">FBR Invoice Form</h2>

          <div className="form-row">
            <Form.Item
              name="BuyerName"
              label={<span className="text-size">Buyer Name</span>}
            >
              <Select
                showSearch
                filterOption={false}
                onSearch={handleSearch}
                options={options}
                defaultValue="Walking Customer"
                size="large"
                placeholder="Enter or select buyer name"
              />
            </Form.Item>
            <Form.Item
              name="BuyerPhoneNumber"
              label={<span className="text-size">Buyer Phone Number</span>}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve(); // allow empty
                    }
                    if (value.trim() === '') {
                      return Promise.reject(
                        new Error('Spaces only are not allowed'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name="BuyerNTN"
              label={<span className="text-size">Buyer NTN/CNIC</span>}
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve(); // allow empty
                    }
                    if (value.trim() === '') {
                      return Promise.reject(
                        new Error('Spaces only are not allowed'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>

          {/*
          <div className="form-row">
            <Form.Item
              name="PaymentMode"
              label={<span className="text-size">Payment Mode</span>}
            >
              <Select size="large" defaultValue={1}>
                <Option value={1}>Cash</Option>
                <Option value={2}>Card</Option>
              </Select>
            </Form.Item>
            </div>

            <Form.Item
              name="InvoiceType"
              label={<span className="text-size">Invoice Type</span>}
            >
              <Select size="large" defaultValue={1}>
                <Option value={1}>Sale Invoice</Option>
              </Select>
            </Form.Item>
          <div className="form-row">
            <Form.Item
              name="date"
              label={<span className="text-size">Date</span>}
              rules={[{ required: true, message: 'Please select date!' }]}
            >
              <DatePicker
                style={{ width: '50%' }}
                size="large"
                disabledDate={(current) =>
                  current && current.isAfter(dayjs(), 'day')
                }
              />
            </Form.Item>
          </div>
*/}
          {/* item detail */}
          <div className="add-items-btn">
            <CiSquarePlus
              onClick={handleAddItem}
              style={{ cursor: 'pointer' }}
              size={32}
            />
          </div>

          <h3 className="form-subtitle">Item Detail</h3>
          <div className="form-row">
            <Form.Item
              name={['item', 'uom']}
              label={<span className="text-size">Unit of measure</span>}
              rules={[{ required: true, message: 'Please select uom!' }]}
            >
              <Select
                showSearch
                options={unitOptions}
                filterOption={(input: any, option: any) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                size="large"
              />
            </Form.Item>
            <Form.Item
              name={['item', 'hsCode']}
              rules={[
                { required: true, message: 'Please enter Hs code!' },
                {
                  validator: (_, value) =>
                    value && value.trim() !== ''
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('Spaces only are not allowed'),
                        ),
                },
              ]}
              label={<span className="text-size">HS Code</span>}
            >
              <Input size="large" />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name={['item', 'SaleValue']}
              label={<span className="text-size">Sale Price</span>}
              style={{ display: 'none' }}
            >
              <InputNumber className="w-full" readOnly size="large" />
            </Form.Item>
            <Form.Item
              name={['item', 'Inclusive']}
              label=" "
              valuePropName="checked"
            >
              <Checkbox>
                <span className="text-size">Inclusive Tax</span>
              </Checkbox>
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name={['item', 'ItemName']}
              label={<span className="text-size">Item Name</span>}
              rules={[
                { required: true, message: 'Please enter name!' },
                {
                  validator: (_, value) =>
                    value && value.trim() !== ''
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error('Spaces only are not allowed'),
                        ),
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name={['item', 'Price']}
              label={<span className="text-size">Price</span>}
              rules={[{ required: true, message: 'Please enter price!' }]}
            >
              <InputNumber className="w-full" size="large" min={0} />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name={['item', 'Quantity']}
              label={<span className="text-size">Quantity</span>}
              rules={[{ required: true, message: 'Please enter quantity!' }]}
            >
              <InputNumber className="w-full" size="large" min={0} />
            </Form.Item>
            <Form.Item
              name="posFee"
              label={<span className="text-size">FBR Pos fee</span>}
            >
              <InputNumber className="w-full" size="large" readOnly min={1} />
            </Form.Item>
          </div>
          <div className="form-row">
            <Form.Item
              name={['item', 'TaxRate']}
              label={<span className="text-size">Tax Rate %</span>}
              rules={[{ required: true, message: 'Please enter tax rate!' }]}
            >
              <InputNumber min={0} max={100} className="w-full" size="large" />
            </Form.Item>
            {/* discount */}
            <Form.Item
              name={['item', 'discount']}
              label={<span className="text-size">Discount</span>}
            >
              <InputNumber min={0} />
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name={['item', 'TotalAmount']}
              label={<span className="text-size">Total Amount</span>}
            >
              <InputNumber className="w-full" readOnly />
            </Form.Item>
            <Form.Item
              name={['item', 'TaxCharged']}
              label={<span className="text-size">Total Tax</span>}
            >
              <InputNumber className="w-full" readOnly size="large" />
            </Form.Item>
          </div>

          <div className="submit-button">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<TiTick size={24} />}
              size="large"
            >
              Submit Invoice
            </Button>
          </div>
        </Form>
      </div>
      <ItemsPreview items={items} />
    </div>
  );
};

export default Invoice;
