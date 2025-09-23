import { rimrafSync } from 'rimraf';
import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const foldersToRemove = [
  webpackPaths.distPath,
  webpackPaths.buildPath,
  webpackPaths.dllPath,
];

foldersToRemove.forEach((folder) => {
  console.log('=========>', folder);
  try {
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
      console.log(`✅ Deleted: ${folder}`);
    }
  } catch (err) {
    console.error(`❌ Failed to delete: ${folder}`, err);
  }
});