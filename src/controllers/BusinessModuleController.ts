import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { BusinessModule } from '../entities/BusinessModule';
import { Business } from '../entities/Business';
import { Module } from '../entities/Module';

const businessModuleRepo = AppDataSource.getRepository(BusinessModule);
const businessRepo = AppDataSource.getRepository(Business);
const moduleRepo = AppDataSource.getRepository(Module);

export class BusinessModuleController {
  static async getAll(req: Request, res: Response) {
    const businessModules = await businessModuleRepo.find({ relations: ['business', 'module'] });
    res.json(businessModules);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const businessModule = await businessModuleRepo.findOne({ where: { id }, relations: ['business', 'module'] });
    if (!businessModule) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    res.json(businessModule);
  }

  static async create(req: Request, res: Response) {
    try {
      const { businessId, moduleId } = req.body;
      if (!businessId || !moduleId) return res.status(400).json({ message: 'Eksik bilgi' });
      const business = await businessRepo.findOne({ where: { id: businessId } });
      const module = await moduleRepo.findOne({ where: { id: moduleId } });
      if (!business || !module) return res.status(404).json({ message: 'İşletme veya modül bulunamadı' });
      const existing = await businessModuleRepo.findOne({ where: { business: { id: businessId }, module: { id: moduleId } }, relations: ['business', 'module'] });
      if (existing) return res.status(409).json({ message: 'Bu işletmeye bu modül zaten atanmış' });
      const businessModule = businessModuleRepo.create({ business, module });
      await businessModuleRepo.save(businessModule);
      res.status(201).json(businessModule);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const businessModule = await businessModuleRepo.findOne({ where: { id } });
    if (!businessModule) return res.status(404).json({ message: 'Kayıt bulunamadı' });
    await businessModuleRepo.remove(businessModule);
    res.json({ message: 'Kayıt silindi' });
  }
} 