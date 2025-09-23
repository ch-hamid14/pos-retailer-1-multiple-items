import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Invoice from './components/Invoice';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Reports from './components/Reports';
export default function App() {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const storageKey = 'installDate';
    const savedDate = localStorage.getItem(storageKey);

    if (!savedDate) {
      localStorage.setItem(storageKey, new Date().toISOString());
    } else {
      const installDate = new Date(savedDate);
      const expiryDate = new Date(installDate);
      expiryDate.setMonth(expiryDate.getMonth() + 6);
      const now = new Date();

      if (now > expiryDate) {
        setExpired(true);
      }
    }
  }, []);

  if (expired) {
    return (
      <div style={{ padding: 20, fontSize: 18, color: 'red' }}>
        ⚠️ This application has expired.
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Invoice />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
