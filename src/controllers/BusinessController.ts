import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Business } from '../entities/Business';

const businessRepo = AppDataSource.getRepository(Business);

export class BusinessController {
  static async getAll(req: Request, res: Response) {
    const businesses = await businessRepo.find();
    res.json(businesses);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const business = await businessRepo.findOne({ where: { id } });
    if (!business) return res.status(404).json({ message: 'İşletme bulunamadı' });
    res.json(business);
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, sector } = req.body;
      if (!name || !sector) return res.status(400).json({ message: 'Eksik bilgi' });
      const existing = await businessRepo.findOne({ where: { name } });
      if (existing) return res.status(409).json({ message: 'Bu isimde işletme zaten var' });
      const business = businessRepo.create({ name, sector });
      await businessRepo.save(business);
      res.status(201).json(business);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, sector } = req.body;
    const business = await businessRepo.findOne({ where: { id } });
    if (!business) return res.status(404).json({ message: 'İşletme bulunamadı' });
    if (name) business.name = name;
    if (sector) business.sector = sector;
    await businessRepo.save(business);
    res.json(business);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const business = await businessRepo.findOne({ where: { id } });
    if (!business) return res.status(404).json({ message: 'İşletme bulunamadı' });
    await businessRepo.remove(business);
    res.json({ message: 'İşletme silindi' });
  }
} 