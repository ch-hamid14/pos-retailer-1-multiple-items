import { Table } from 'antd';

const PreviewReceipt = ({ previewRecord }: any) => {
  const columns = [
    {
      title: <span style={{ fontSize: 18 }}>FBR Invoice No.</span>,
      dataIndex: 'FBR_InvoiceNumber',
      render: (el: any) => <span style={{ fontSize: 18 }}>{el}</span>,
      width: 200,
    },
    {
      title: <span style={{ fontSize: 18 }}>Buyer Name</span>,
      dataIndex: 'BuyerName',
      render: (el: any) => <span style={{ fontSize: 18 }}>{el}</span>,
      width: 200,
    },
    {
      title: <span style={{ fontSize: 18 }}>Buyer NTN/CNIC</span>,
      dataIndex: 'BuyerNTN',
      render: (el: any) => (
        <span style={{ fontSize: 18 }}>{el ? el : 'N/A'}</span>
      ),
      width: 200,
    },
    {
      title: <span style={{ fontSize: 18 }}>Items</span>,
      dataIndex: 'items_count',
      render: (_: any, record: any) => (
        <span style={{ fontSize: 18 }}>{record?.items.length}</span>
      ),
    },
    {
      title: <span style={{ fontSize: 18 }}>Created At</span>,
      dataIndex: 'createdAt',
      render: (val: any) => (
        <span style={{ fontSize: 18 }}>{new Date(val).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={
          Array.isArray(previewRecord) ? previewRecord : [previewRecord]
        }
        pagination={false}
        scroll={{ x: 300 }}
      />
    </>
  );
};

export default PreviewReceipt;
