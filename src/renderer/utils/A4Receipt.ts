import { InvoiceHeaderData } from './data';

interface ReceiptData {
  businessName: string;
  address: string;
  businessNumber: string;
  invoiceNumber: string | number;
  customerName: string;
  dateTime: string;
  hsCode: string;
  itemName: string;
  price: number;
  quantity: number;
  discount: number;
  totalAmount: number;
  subTotal: number;
  taxCharged: number;
  posFee: number;
  finalTotal: number;
  fbrInvoiceNumber?: string;
  time: string;
  ntn_Cnic: string;
  phone: string;
  items: any[];
}
export const generateReceiptHtml = ({
  businessName,
  address,
  businessNumber,
  customerName,
  dateTime,
  fbrInvoiceNumber,
  time,
  ntn_Cnic,
  phone,
  items,
}: ReceiptData) => {
  const posFee = 1;
  const itemRows = items
    .map((item) => {
      const i = item.dataValues;
      return `
      <tr>
        <td>${i.Item_Name}</td>
        <td>${i.Item_HSCode}</td>
        <td>${i.Item_Price}</td>
        <td>${i.Item_TaxCharged}</td>
        <td>${i.Item_Quantity}</td>
        <td>${i.Item_Discount}</td>
        <td>${i.Item_SaleValue}</td>
      </tr>
      `;
    })
    .join('');

  const subTotalValue = items.reduce(
    (acc, item) => acc + item.dataValues.Item_SaleValue,
    0,
  );

  const taxChargedValue = items.reduce(
    (acc, item) => acc + item.dataValues.Item_TaxCharged,
    0,
  );
  const discountValue = items.reduce(
    (acc, item) => acc + (item.dataValues.Item_Discount ?? 0),
    0,
  );

  const finalTotalValue = items.reduce(
    (acc, item) => acc + (item.dataValues.Item_TotalAmount ?? 0),
    0,
  );

  const grandTotal = finalTotalValue + posFee - discountValue;

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      padding: 0;
      font-size: 14px;
      color: #000;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .mb-5 { margin-bottom: 5px; }
    .mb-10 { margin-bottom: 10px; }
    .mt-10 { margin-top: 10px; }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .table th, .table td {
      padding: 8px 10px;
      border: 1px solid #ccc;
    }
    .table th {
      background: #f5f5f5;
    }
    .no-border td {
      border: none;
      padding: 5px 10px;
    }
    .bold { font-weight: bold; }
    .footer-line {
      border-top: 1px solid black;
      padding-top: 8px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="text-center mb-5">
    <div style="font-weight: 700; font-size: 24px;">${businessName}</div>
    <div class="mb-5">${address}</div>
    <div class="mb-10">Phone: ${businessNumber}</div>
    <div class="mb-10">Seller NTN/CNIC: ${InvoiceHeaderData.SELLER_NTN}</div>
    <div style="font-weight: 600; font-size: 20px;">Sale Invoice</div>
  </div>

  <table class="no-border">
    <tr>
      <td><strong>Date:</strong> ${dateTime}</td>
    </tr>
  </table>
  <div class="mb-10"><strong>Customer:</strong> ${customerName}</div>
  <div class="mb-10"><strong>NTN/CNIC:</strong> ${ntn_Cnic}</div>
  <div class="mb-10"><strong>Phone:</strong> ${phone}</div>


  <table class="table">
    <thead>
      <tr>
        <th>Desc.</th>
        <th>HS Code</th>
        <th>Price</th>
        <th>Sale Tax</th>
        <th>Qty</th>
        <th>Discount</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}    
    </tbody>
  </table>

  <table class="no-border mt-10">
    <tr>
      <td class="bold">Subtotal</td>
      <td class="text-right">${subTotalValue}</td>
    </tr>
    <tr>
      <td class="bold">Tax Charged</td>
      <td class="text-right">${taxChargedValue.toFixed(2)}</td>
    </tr>
    <tr>
      <td class="bold">POS Fee</td>
      <td class="text-right">${posFee}</td>
    </tr>
    <tr>
      <td class="bold">Discount</td>
      <td class="text-right">${discountValue}</td>
    </tr>
    <tr>
      <td class="bold">Total</td>
      <td class="text-right">${grandTotal.toFixed(2)}</td>
    </tr>
  </table>

  <div class="text-center mt-10" style="font-size: 16px; font-weight: 600;">
    This Receipt / Invoice is verified by FBR POS Invoicing System
  </div>

  <div class="text-center mt-10">
    Fiscal Invoice Number: ${fbrInvoiceNumber || 'Not Available'}
  </div>

  <!-- QR Code Canvas -->
  <div class="text-center mt-10">
    <canvas id="qrCode" width="128" height="128"></canvas>
  </div>

  <div class="footer-line text-center bold mt-10">
    Thank You, Please Visit Again
  </div>

  <div class="text-right mt-10">${time}</div>

  <script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
  <script>
    const qr = new QRious({
      element: document.getElementById('qrCode'),
      value: "${fbrInvoiceNumber}",
      size: 128,
      level: 'H'
    });
  </script>
</body>
</html>
`;
};
