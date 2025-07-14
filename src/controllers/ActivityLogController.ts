import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ActivityLog } from '../entities/ActivityLog';
import { User } from '../entities/User';
import { Business } from '../entities/Business';

const activityLogRepo = AppDataSource.getRepository(ActivityLog);
const userRepo = AppDataSource.getRepository(User);
const businessRepo = AppDataSource.getRepository(Business);

export class ActivityLogController {
  static async getAll(req: Request, res: Response) {
    const logs = await activityLogRepo.find({ relations: ['user', 'business'] });
    res.json(logs);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const log = await activityLogRepo.findOne({ where: { id }, relations: ['user', 'business'] });
    if (!log) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    res.json(log);
  }

  static async create(req: Request, res: Response) {
    try {
      const { action, metadata, userId, businessId } = req.body;
      if (!action || !userId || !businessId) return res.status(400).json({ message: 'Eksik bilgi' });
      const user = await userRepo.findOne({ where: { id: userId } });
      const business = await businessRepo.findOne({ where: { id: businessId } });
      if (!user || !business) return res.status(404).json({ message: 'Kullanıcı veya işletme bulunamadı' });
      const log = activityLogRepo.create({ action, metadata, user, business });
      await activityLogRepo.save(log);
      res.status(201).json(log);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const log = await activityLogRepo.findOne({ where: { id } });
    if (!log) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    await activityLogRepo.remove(log);
    res.json({ message: 'Kayıt silindi' });
  }
} 