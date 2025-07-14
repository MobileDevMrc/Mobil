import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { IncomeExpense } from '../entities/IncomeExpense';
import { User } from '../entities/User';
import { Business } from '../entities/Business';

const incomeExpenseRepo = AppDataSource.getRepository(IncomeExpense);
const userRepo = AppDataSource.getRepository(User);
const businessRepo = AppDataSource.getRepository(Business);

export class IncomeExpenseController {
  static async getAll(req: Request, res: Response) {
    const items = await incomeExpenseRepo.find({ relations: ['user', 'business'] });
    res.json(items);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const item = await incomeExpenseRepo.findOne({ where: { id }, relations: ['user', 'business'] });
    if (!item) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    res.json(item);
  }

  static async create(req: Request, res: Response) {
    try {
      const { type, amount, description, userId, businessId } = req.body;
      if (!type || !amount || !description || !userId || !businessId) return res.status(400).json({ message: 'Eksik bilgi' });
      const user = await userRepo.findOne({ where: { id: userId } });
      const business = await businessRepo.findOne({ where: { id: businessId } });
      if (!user || !business) return res.status(404).json({ message: 'Kullanıcı veya işletme bulunamadı' });
      const item = incomeExpenseRepo.create({ type, amount, description, user, business });
      await incomeExpenseRepo.save(item);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { type, amount, description } = req.body;
    const item = await incomeExpenseRepo.findOne({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    if (type) item.type = type;
    if (amount !== undefined) item.amount = amount;
    if (description) item.description = description;
    await incomeExpenseRepo.save(item);
    res.json(item);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const item = await incomeExpenseRepo.findOne({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    await incomeExpenseRepo.remove(item);
    res.json({ message: 'Kayıt silindi' });
  }
} 