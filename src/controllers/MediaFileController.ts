import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { MediaFile } from '../entities/MediaFile';
import { User } from '../entities/User';
import { Business } from '../entities/Business';

const mediaFileRepo = AppDataSource.getRepository(MediaFile);
const userRepo = AppDataSource.getRepository(User);
const businessRepo = AppDataSource.getRepository(Business);

export class MediaFileController {
  static async getAll(req: Request, res: Response) {
    const files = await mediaFileRepo.find({ relations: ['user', 'business'] });
    res.json(files);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const file = await mediaFileRepo.findOne({ where: { id }, relations: ['user', 'business'] });
    if (!file) return res.status(404).json({ message: 'Dosya bulunamadı' });
    res.json(file);
  }

  static async create(req: Request, res: Response) {
    try {
      const { url, type, userId, businessId } = req.body;
      if (!url || !type || !userId || !businessId) return res.status(400).json({ message: 'Eksik bilgi' });
      const user = await userRepo.findOne({ where: { id: userId } });
      const business = await businessRepo.findOne({ where: { id: businessId } });
      if (!user || !business) return res.status(404).json({ message: 'Kullanıcı veya işletme bulunamadı' });
      const file = mediaFileRepo.create({ url, type, user, business });
      await mediaFileRepo.save(file);
      res.status(201).json(file);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { url, type } = req.body;
    const file = await mediaFileRepo.findOne({ where: { id } });
    if (!file) return res.status(404).json({ message: 'Dosya bulunamadı' });
    if (url) file.url = url;
    if (type) file.type = type;
    await mediaFileRepo.save(file);
    res.json(file);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const file = await mediaFileRepo.findOne({ where: { id } });
    if (!file) return res.status(404).json({ message: 'Dosya bulunamadı' });
    await mediaFileRepo.remove(file);
    res.json({ message: 'Dosya silindi' });
  }
} 