import { ipcMain, BrowserWindow, app } from 'electron';
import { LISTENERS } from '../../common/constants';
import { PosPrinter } from '@3ksy/electron-pos-printer';
import path from 'path';
import fs from 'fs';

ipcMain.on(LISTENERS.PRINT, (event, data, printerName) => {
  const options = {
    preview: false,
    margin: 'auto',  
    copies: 1,
    printerName,
    timeOutPerLine: 1000,
    pageSize: '80mm', //thermal size
    // pageSize: { width: 794, height: 1123 }, //A4
  };
  handlePrinter(data, options);
});

const handlePrinter = (data: any, opt: any) => {
  try {
    console.log(opt.printerName);
    PosPrinter.print(data, {
      ...opt,
      timeOutPerLine: 5000,
      silent: true,
    })
      .then(console.log)
      .catch(console.error);
  } catch (err) {
    console.error(err);
  }
};

//download Receipt for A4 size
ipcMain.on(LISTENERS.A4RECEIPT_DOWNLOAD, async (event, receiptHtml) => {
  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });

  // ✅ Register the listener before loading the URL
  pdfWindow.webContents.once('did-finish-load', async () => {
    console.log('✅ Receipt HTML loaded into hidden window');
    try {
      const pdfBuffer = await pdfWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
      });

      const downloadPath = path.join(
        app.getPath('downloads'),
        `Receipt-${Date.now()}.pdf`,
      );

      fs.writeFileSync(downloadPath, pdfBuffer);
      console.log('✅ PDF written to:', downloadPath);

      // Optional: open the file automatically after saving
      // shell.openPath(downloadPath);

      pdfWindow.close();
    } catch (error: any) {
      console.error('❌ PDF generation failed:', error);
      pdfWindow.close();
    }
  });

  // ✅ Load AFTER setting up the listener
  pdfWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(receiptHtml)}`,
  );
});
