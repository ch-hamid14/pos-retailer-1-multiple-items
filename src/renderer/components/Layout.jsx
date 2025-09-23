import React, { useState } from 'react';
import { Layout as RLayout, Menu, Image } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { IoSettings } from 'react-icons/io5';
import SettingModal from './SettingModal';
import { useNavigate, Outlet } from 'react-router-dom';
import signature from '../images/signature.png';

const Layout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === '1') navigate('/');
    if (e.key === '2') navigate('/reports');
  };

  return (
    <>
      <RLayout
        style={{
          width: '100%',
        }}
      >
        <Header
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            onClick={handleMenuClick}
            items={[
              { key: '1', label: 'Home' },
              { key: '2', label: 'Report' },
            ]}
          />
          {/* <IoSettings
            onClick={() => setOpen(!open)}
            size={24}
            color="#fff"
            style={{ cursor: 'pointer' }}
          /> */}
        </Header>
        <div
          style={{
            marginTop: 64,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            padding: 24,
          }}
        >
          <Outlet />
        </div>
      </RLayout>
      <SettingModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Layout;
