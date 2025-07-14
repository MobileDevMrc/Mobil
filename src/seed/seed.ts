import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { Business } from '../entities/Business';
import { Module } from '../entities/Module';
import { BusinessModule } from '../entities/BusinessModule';
import { StoreOrder } from '../entities/StoreOrder';
import { MediaFile } from '../entities/MediaFile';
import { ActivityLog } from '../entities/ActivityLog';
import { IncomeExpense } from '../entities/IncomeExpense';
import { hashPassword } from '../utils/hash';

async function seed() {
  await AppDataSource.initialize();

  // Temizle
  await AppDataSource.getRepository(ActivityLog).clear();
  await AppDataSource.getRepository(MediaFile).clear();
  await AppDataSource.getRepository(StoreOrder).clear();
  await AppDataSource.getRepository(BusinessModule).clear();
  await AppDataSource.getRepository(IncomeExpense).clear();
  await AppDataSource.getRepository(User).clear();
  await AppDataSource.getRepository(Module).clear();
  await AppDataSource.getRepository(Business).clear();

  // Admin user
  const admin = new User();
  admin.email = 'admin@example.com';
  admin.passwordHash = await hashPassword('admin123');
  admin.name = 'Admin';
  admin.role = UserRole.ADMIN;
  await AppDataSource.getRepository(User).save(admin);

  // Business owner
  const owner = new User();
  owner.email = 'owner@example.com';
  owner.passwordHash = await hashPassword('owner123');
  owner.name = 'Business Owner';
  owner.role = UserRole.OWNER;
  await AppDataSource.getRepository(User).save(owner);

  // Business
  const business = new Business();
  business.name = 'Demo Business';
  business.sector = 'IT';
  business.users = [owner];
  await AppDataSource.getRepository(Business).save(business);

  // Module
  const module1 = new Module();
  module1.name = 'CRM';
  module1.description = 'Customer Relationship Management';
  await AppDataSource.getRepository(Module).save(module1);

  const module2 = new Module();
  module2.name = 'Finance';
  module2.description = 'Finance Management';
  await AppDataSource.getRepository(Module).save(module2);

  // BusinessModule
  const bm1 = new BusinessModule();
  bm1.business = business;
  bm1.module = module1;
  await AppDataSource.getRepository(BusinessModule).save(bm1);

  // StoreOrder
  const order = new StoreOrder();
  order.business = business;
  order.module = module2;
  order.amount = 1000;
  order.status = 'paid';
  await AppDataSource.getRepository(StoreOrder).save(order);

  // MediaFile
  const media = new MediaFile();
  media.url = 'https://example.com/file.jpg';
  media.type = 'image';
  media.user = owner;
  media.business = business;
  await AppDataSource.getRepository(MediaFile).save(media);

  // ActivityLog
  const log = new ActivityLog();
  log.action = 'login';
  log.metadata = { ip: '127.0.0.1' };
  log.user = owner;
  log.business = business;
  await AppDataSource.getRepository(ActivityLog).save(log);

  // IncomeExpense
  const income = new IncomeExpense();
  income.type = 'income';
  income.amount = 5000;
  income.description = 'Initial investment';
  income.user = owner;
  income.business = business;
  await AppDataSource.getRepository(IncomeExpense).save(income);

  const expense = new IncomeExpense();
  expense.type = 'expense';
  expense.amount = 1200;
  expense.description = 'Office rent';
  expense.user = owner;
  expense.business = business;
  await AppDataSource.getRepository(IncomeExpense).save(expense);

  console.log('Seed işlemi tamamlandı!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed hatası:', err);
  process.exit(1);
}); 