import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';
import businessRoutes from './routes/business';
import moduleRoutes from './routes/module';
import businessModuleRoutes from './routes/businessModule';
import storeOrderRoutes from './routes/storeOrder';
import mediaFileRoutes from './routes/mediaFile';
import activityLogRoutes from './routes/activityLog';
import incomeExpenseRoutes from './routes/incomeExpense';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();
app.use(express.json());

// Sağlık kontrolü endpoint'i
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth route'u
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/business-module', businessModuleRoutes);
app.use('/api/store-order', storeOrderRoutes);
app.use('/api/media-file', mediaFileRoutes);
app.use('/api/activity-log', activityLogRoutes);
app.use('/api/income-expense', incomeExpenseRoutes);

// Veritabanı bağlantısı ve sunucu başlatma
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Veritabanı bağlantı hatası:', err);
  }); 