import { Sequelize } from 'sequelize';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import mello from '../../../package.json';
import sqlite3 from 'sqlite3';

function getAppStoragePath() {
  try {
    fs.accessSync('D:/', fs.constants.W_OK);
    return 'D:/';
  } catch {
    try {
      fs.accessSync('E:/', fs.constants.W_OK);
      return 'E:/';
    } catch {
      return app.getPath('userData');
    }
  }
}
const appPath = getAppStoragePath();

// const appPath = app.getPath('userData');
const userDir = path.join(appPath, mello.name);

if (!fs.existsSync(userDir)) {
  try {
    fs.mkdirSync(userDir, { recursive: true });
  } catch (err) {
    throw Error('Unable to access D drive!');
  }
}

const dbPath = path.join(userDir, 'mello-fbr-pos.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: dbPath,
});

sequelize
  .authenticate()
  .then(async () => {
    console.log('Connection has been established successfully.');
    //@ts-ignore
    import('./migrations');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
