import dayjs from 'dayjs';
import { InvoiceHeaderData } from './data';

const getInvoiceHeader = (shopName: string, address: string, phone: string) => [
  {
    type: 'text',
    value: shopName,
    style: {
      fontWeight: '700',
      textAlign: 'center',
      fontSize: '24px',
      // marginTop: '30px',
      fontFamily: 'Arial',
    },
  },
  {
    type: 'text',
    value: address,
    style: {
      fontWeight: '500',
      textAlign: 'center',
      fontSize: '12px',
      fontFamily: 'Arial',
      margin: '4px',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
  },
  {
    type: 'text',
    value: `Phone: ${phone}`,
    style: {
      fontWeight: '500',
      textAlign: 'center',
      fontSize: '12px',
      fontFamily: 'Arial',
    },
  },
  {
    type: 'text',
    value: 'Sale Invoice',
    style: {
      fontWeight: '600',
      textAlign: 'center',
      fontSize: '20px',
      marginBlock: '10px',
      fontFamily: 'Arial',
    },
  },
];

const getInvoiceFooter = (invoiceNumber = '') => [
  {
    type: 'text',
    value: '',
    style: {
      fontWeight: '500',
      fontSize: '12px',
      fontFamily: 'Arial',
      borderTop: '1px solid black',
      paddingTop: '10px',
      // marginTop: '10px',
      textAlign: 'left',
    },
  },
  {
    type: 'text',
    value: `This Receipt / Invoice is verified by FBR POS Invoicing System`,
    style: {
      fontWeight: '600',
      textAlign: 'center',
      fontSize: '16px',
      margin: '10px 20px 10px 20px', //checking this one
    },
  },
  {
    type: 'qrCode',
    value: invoiceNumber,
    style: {
      width: 10,
      height: 40,
      display: 'block',
      margin: '10px auto', //checking this one by adding 5px default 10px
    },
  },
  // {
  //   type: 'text',
  //   value: `Fiscal Invoice Number: ${invoiceNumber}`,
  //  style: {
  //   fontWeight: '500',
  //   fontSize: '12px',
  //   fontFamily: 'Arial',
  //   textAlign: 'center',
  //   display: 'block',       // allow centering
  //   marginLeft: '2px',
  //   marginRight: '2px',     // optional, to balance left/right spacing
  //   whiteSpace: 'normal',   // allow wrapping
  //   wordWrap: 'break-word', // wrap long words
  // },
  // },
  {
    type: 'text',
    value: 'Thank You,Please Visit Again',
    style: {
      fontWeight: '800',
      textAlign: 'center',
      fontSize: '12px',
      fontFamily: 'Arial',
      borderBlock: '1px solid black',
      paddingTop: '5px',
      paddingBottom: '5px',
      marginTop: '10px',
      marginBottom: '10px',
    },
  },
  {
    type: 'text',
    value: dayjs().format('h:mm A'),
    style: {
      fontWeight: '500',
      fontSize: '12px',
      fontFamily: 'Arial',
      textAlign: 'right',
    },
  },
];

//print Invoice

export const getInvoicePrintArray = (
  invNo = '',
  customerName = '',
  data: any,
  invoiceNumber = '',
  date: any,
  subTotal: any,
  taxCharged = 0,
  posFee: any,
  discount = 0,
  totalAmount: any,
  hsCode: any,
  ntn_Cnic: any,
  phone: any,
) => {
  const headerArr = getInvoiceHeader(
    InvoiceHeaderData.BUSINESS_NAME,
    InvoiceHeaderData.ADDRESS,
    InvoiceHeaderData.PHONE,
  );
  const footerArr = getInvoiceFooter(invoiceNumber);

  const invoiceLine = {
    type: 'table',
    style: {
      fontFamily: 'Arial',
      padding: '0 8px', // apply left/right padding
      whiteSpace: 'pre-wrap',
    },
    tableHeader: [],
    tableBody: [
      [
        {
          type: 'text',
          value: `\u00A0\u00A0\u00A0\u00A0\u00A0Date: ${dayjs(date).format('DD/MM/YYYY')}`,
        }, //add unicode spaces
        // { type: 'text', value: `Inv#: ${invNo}` },
      ],
    ],
    tableHeaderStyle: {
      textAlign: 'left',
      paddingInline: '10px',
      padding: '0 8px', // apply left/right padding
      whiteSpace: 'pre-wrap',
    },
    tableBodyStyle: {
      borderBlock: '0px solid #ddd',
    },
    tableFooterStyle: {
      borderBlock: '0px solid #ddd',
    },
  };
  const customerArr = [
    // {
    //   type: 'text',
    //   value: `    HS Code: ${hsCode}`,
    //   style: {
    //     fontWeight: '500',
    //     fontSize: '14px',
    //     marginBlock: '10px',
    //     fontFamily: 'Arial',
    //     textAlign: 'left',
    //      padding: '0 4px',        // apply left/right padding
    // whiteSpace: 'pre-wrap'
    //   },
    // },
    {
      type: 'text',
      value: `    Customer: ${customerName}`,
      style: {
        fontWeight: '500',
        fontSize: '14px',
        marginBlock: '10px',
        fontFamily: 'Arial',
        textAlign: 'left',
        padding: '0 4px', // apply left/right padding
        whiteSpace: 'pre-wrap',
      },
    },
    {
      type: 'text',
      value: `    NTN/CNIC: ${ntn_Cnic}`,
      style: {
        fontWeight: '500',
        fontSize: '14px',
        marginBlock: '10px',
        fontFamily: 'Arial',
        textAlign: 'left',
        padding: '0 4px', // apply left/right padding
        whiteSpace: 'pre-wrap',
      },
    },
    {
      type: 'text',
      value: `    Phone: ${phone}`,
      style: {
        fontWeight: '500',
        fontSize: '14px',
        marginBlock: '10px',
        fontFamily: 'Arial',
        textAlign: 'left',
        padding: '0 4px', // apply left/right padding
        whiteSpace: 'pre-wrap',
      },
    },
  ];
  const invoiceBody = {
    type: 'table',
    style: {
      borderBlock: '1px solid #ddd',
      fontFamily: 'Arial',
      fontSize: '12px',
      width: '100%',
      tableLayout: 'fixed',
    },
    tableHeader: [
      `\u00A0\u00A0\u00A0\u00A0Desc.`,
      'Price',
      'Qty',
      'Disc',
      'Total',
    ],
    tableBody: data.map((row: any) =>
      row.map((cell: any, index: number) => ({
        type: 'text',
        value:
          index === 0
            ? '\u00A0\u00A0\u00A0\u00A0' + String(cell)
            : String(cell),
        style: {
          fontSize: '12px',
          fontFamily: 'Arial',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          paddingLeft: index === 0 ? '10px' : undefined,
        },
      })),
    ),
    tableHeaderStyle: {
      textAlign: 'left',
      padding: '4px 10px',
      whiteSpace: 'nowrap',
    },
    tableBodyStyle: {
      borderBlock: '1px solid #ddd',
    },
    tableFooterStyle: {
      borderBlock: '1px solid #ddd',
    },
  };

  const sum = {
    type: 'table',
    style: {
      borderBlock: 'none',
      fontFamily: 'Arial',
      textAlign: 'left',
      padding: '0px',
      marginLeft: '3px',
    },
    tableHeader: [' ', ' ', ' ', ' ', ' '],
    tableBody: [
      [
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: ` Subtotal`,
          style: {
            fontWeight: 'bold',
            marginLeft: '3px',
          },
        },
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: subTotal,
        },
      ],
      [
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: ` Tax Charged`,
          style: {
            fontWeight: 'bold',
          },
        },
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: taxCharged.toFixed(2),
        },
      ],
      [
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: ` POS Fee`,
          style: {
            fontWeight: 'bold',
          },
        },
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: posFee,
        },
      ],
      [
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: ` Discount`,
          style: {
            fontWeight: 'bold',
          },
        },
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: (discount ?? 0).toString(),
        },
      ],
      [
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: ` Total`,
          style: {
            fontWeight: 'bold',
          },
        },
        {
          type: 'text',
          value: ' ',
        },
        {
          type: 'text',
          value: totalAmount.toFixed(2),
        },
      ],
    ],
    tableHeaderStyle: {
      border: 'none',
    },
    tableBodyStyle: {
      border: 'none',
    },
    tableFooterStyle: {
      border: 'none',
    },
  };

  return [
    ...headerArr,
    invoiceLine,
    ...customerArr,
    invoiceBody,
    sum,
    ...footerArr,
  ];
};
