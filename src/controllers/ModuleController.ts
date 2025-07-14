import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Module } from '../entities/Module';

const moduleRepo = AppDataSource.getRepository(Module);

export class ModuleController {
  static async getAll(req: Request, res: Response) {
    const modules = await moduleRepo.find();
    res.json(modules);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const module = await moduleRepo.findOne({ where: { id } });
    if (!module) return res.status(404).json({ message: 'Modül bulunamadı' });
    res.json(module);
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      if (!name || !description) return res.status(400).json({ message: 'Eksik bilgi' });
      const existing = await moduleRepo.findOne({ where: { name } });
      if (existing) return res.status(409).json({ message: 'Bu isimde modül zaten var' });
      const module = moduleRepo.create({ name, description });
      await moduleRepo.save(module);
      res.status(201).json(module);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;
    const module = await moduleRepo.findOne({ where: { id } });
    if (!module) return res.status(404).json({ message: 'Modül bulunamadı' });
    if (name) module.name = name;
    if (description) module.description = description;
    await moduleRepo.save(module);
    res.json(module);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const module = await moduleRepo.findOne({ where: { id } });
    if (!module) return res.status(404).json({ message: 'Modül bulunamadı' });
    await moduleRepo.remove(module);
    res.json({ message: 'Modül silindi' });
  }
} 