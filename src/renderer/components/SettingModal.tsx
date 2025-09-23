import { Form, Input, message, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
const SettingModal = ({ open, setOpen }: any) => {
  const [form] = useForm();

  useEffect(() => {
    const printerName = localStorage.getItem('printerName');
    form.setFieldsValue({
      printerName,
    });
  }, []);
  const handleSubmit = async () => {
    const data = await form.validateFields();
    localStorage.setItem('printerName', data?.printerName);
    message.success('Saved!');
    setOpen(false);
  };
  return (
    <>
      <Modal open={open} onCancel={() => setOpen(false)} onOk={handleSubmit}>
        <Form layout="vertical" form={form}>
          <Form.Item
            name={'printerName'}
            label="Printer Name"
            rules={[{ required: true, message: 'Please enter printer name' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SettingModal;
