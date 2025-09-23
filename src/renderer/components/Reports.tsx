import { Button, Drawer, Input, message, Table } from 'antd';
import { useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { FaPrint } from 'react-icons/fa6';
import { receiptApi } from '../services';
import PreviewReceipt from './PreviewReceipt';
import { IoClose } from 'react-icons/io5';
import { getInvoicePrintArray } from '../utils';
import { LISTENERS } from '../../common/constants';
import { generateReceiptHtml } from '../utils/A4Receipt';
import { formatDate } from '../utils/format';
import { FaFileDownload } from 'react-icons/fa';
import { InvoiceHeaderData } from '../utils/data';
const { Search } = Input;
const Reports = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 20,
  });
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<any>([]);
  const printerName = localStorage.getItem('printerName');

  useEffect(() => {
    handleGetAllInvoice();
  }, []);

  useEffect(() => {
    handleGetAllInvoice();
  }, [pagination.page, pagination.pageSize]);

  const handleGetAllInvoice = async () => {
    const res = await receiptApi.getAllReceipt(pagination);
    setPagination({
      ...pagination,
      total: res.data.total,
    });
    setDataSource(res.data.data);
  };
  const handleTableChange = (data: any) => {
    setPagination({
      ...pagination,
      pageSize: data.pageSize,
      page: data.current,
    });
  };

  const handleClick = (record: any, type: string) => {
    setPreviewRecord(record);
    if (type === 'detail') {
      setOpen(true);
    } else if (type == 'download') {
      const receiptData = {
        businessName: InvoiceHeaderData.BUSINESS_NAME,
        address: InvoiceHeaderData.ADDRESS,
        businessNumber: InvoiceHeaderData.PHONE,
        phone: record.BuyerPhoneNumber || 'N/A',
        invoiceNumber: record.InvoiceNumber,
        customerName: record.BuyerName || 'Walking Customer',
        dateTime: formatDate(record.DateTime),
        hsCode: record.Item_HSCode,
        itemName: record.Item_Name,
        price: record.Item_Price,
        ntn_Cnic: record.BuyerNTN || 'N/A',
        quantity: record.Item_Quantity,
        discount: record.Item_Discount,
        totalAmount: record.Item_TotalAmount,
        subTotal: record.Item_SaleValue,
        taxCharged: record.Item_TaxCharged,
        posFee: record.Item_FbrPosFee,
        finalTotal: record.Item_TotalAmount,
        fbrInvoiceNumber: record.FBR_InvoiceNumber,
        time: new Date().toLocaleTimeString(),
        items: record.items || [],
      };
      const receiptHtml = generateReceiptHtml(receiptData);
      window.electron.ipcRenderer.send(
        LISTENERS.A4RECEIPT_DOWNLOAD,
        receiptHtml,
      );
      message.success('Receipt downloaded successfully');
    } else {
      const arr = getInvoicePrintArray(
        record.InvoiceNumber,
        record.BuyerName || 'Walking Customer',
        record.items?.map((item: any) => [
          item.dataValues.Item_Name,
          item.dataValues.Item_Price,
          item.dataValues.Item_Quantity,
          item.dataValues.Item_Discount,
          item.dataValues.Item_TotalAmount,
        ]) || [], // ✅ this is now a flat array of arrays
        record.FBR_InvoiceNumber, // FBR invoice number
        record.DateTime, // date
        record.items?.reduce(
          (acc: any, item: any) => acc + (item.dataValues.Item_SaleValue ?? 0),
          0,
        ) || 0,
        record.items?.reduce(
          (acc: any, item: any) => acc + (item.dataValues.Item_TaxCharged ?? 0),
          0,
        ) || 0,
        record.items?.reduce(
          (acc: any, item: any) => acc + (item.dataValues.Item_FbrPosFee ?? 0),
          0,
        ) || 0,
        record.items?.reduce(
          (acc: any, item: any) => acc + (item.dataValues.Item_Discount ?? 0),
          0,
        ) || 0,
        record.items?.reduce(
          (acc: any, item: any) =>
            acc + (item.dataValues.Item_TotalAmount ?? 0),
          0,
        ) || 0,
        record.items?.[0]?.dataValues.Item_HSCode || '',
        record.BuyerNTN || 'N/A',
        record.BuyerPhoneNumber || 'N/A',
      );

      window.electron.ipcRenderer.send(LISTENERS.PRINT, arr, printerName);
      message.success('Receipt generated successfully');
    }
  };

  const handleChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleSearchText = async (value: string) => {
    if (!value) {
      handleGetAllInvoice();
      return;
    }

    const res = await receiptApi.getAllReceipt({
      search: value,
      page: 1,
      pageSize: pagination.pageSize,
    });

    if (res.error) {
      setDataSource([]);
      setPagination({
        page: 1,
        pageSize: 20,
        total: 0,
      });
      return;
    }

    setDataSource(res.data.data);
    setPagination({
      page: 1,
      pageSize: pagination.pageSize,
      total: res.data.total,
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: '#',
      render: (_: any, __: any, index: number) =>
        (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Buyer Name',
      dataIndex: 'BuyerName',
    },
    {
      title: 'Invoice Number',
      dataIndex: 'FBR_InvoiceNumber',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_Amount',
      render: (_: any, el: any) => {
        const totalAmount = el.items.reduce(
          (acc: number, val: any) => acc + val.dataValues.Item_TotalAmount,
          0,
        );

        return <span>{totalAmount.toFixed(2)}</span>
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            onClick={() => handleClick(record, 'detail')}
            icon={<BiCommentDetail />}
            size="large"
            type="primary"
          >
            Preview Detail
          </Button>
          <Button
            onClick={() => handleClick(record, 'download')}
            icon={<FaFileDownload />}
            size="large"
            type="primary"
          >
            Download PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 12,
          marginTop: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Search
          size="large"
          placeholder="Search by invoice number / FBR invoice number e.g,1751010305433"
          onChange={handleChange}
          value={searchText}
          enterButton="Search"
          onSearch={handleSearchText}
          style={{ width: 700 }}
        />
        <a href="https://e.fbr.gov.pk/InvoiceInfo.aspx" target="blank">
          <Button type="primary" size="large">
            Verify Invoice
          </Button>
        </a>
      </div>
      <Table
        columns={columns}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['20', '50', '100'],
          total: pagination.total,
        }}
        dataSource={dataSource}
        onChange={handleTableChange}
        scroll={{ x: 250 }}
      />
      <Drawer
        title="Receipt Preview"
        open={open}
        onClose={() => setOpen(false)}
        placement="bottom"
        closable={false}
        extra={
          <IoClose
            size={24}
            onClick={() => setOpen(false)}
            style={{ cursor: 'pointer' }}
          />
        }
        className="receipt-preview"
      >
        <PreviewReceipt previewRecord={previewRecord} />
      </Drawer>
    </>
  );
};

export default Reports;
