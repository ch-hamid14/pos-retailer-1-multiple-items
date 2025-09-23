import createReceipt from './receipt';
import { Sequelize } from 'sequelize';
import { sequelize } from '..';
import CreateReceiptItem from './receiptItems';

const migrationsPath = [createReceipt, CreateReceiptItem];
const runMigrations = async () => {
  const transaction = await sequelize.transaction();
  try {
    for (const migration of migrationsPath) {
      await migration.up(sequelize.getQueryInterface(), Sequelize);
    }
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

runMigrations()
  .then(() => {
    console.log('All migrations performed successfully.');
  })
  .catch((err) => {
    console.error('Migration failed:', err);
  });
