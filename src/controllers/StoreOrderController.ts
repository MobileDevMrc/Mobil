import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { StoreOrder } from '../entities/StoreOrder';
import { Business } from '../entities/Business';
import { Module } from '../entities/Module';

const storeOrderRepo = AppDataSource.getRepository(StoreOrder);
const businessRepo = AppDataSource.getRepository(Business);
const moduleRepo = AppDataSource.getRepository(Module);

export class StoreOrderController {
  static async getAll(req: Request, res: Response) {
    const orders = await storeOrderRepo.find({ relations: ['business', 'module'] });
    res.json(orders);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const order = await storeOrderRepo.findOne({ where: { id }, relations: ['business', 'module'] });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    res.json(order);
  }

  static async create(req: Request, res: Response) {
    try {
      const { businessId, moduleId, amount, status } = req.body;
      if (!businessId || !moduleId || !amount || !status) return res.status(400).json({ message: 'Eksik bilgi' });
      const business = await businessRepo.findOne({ where: { id: businessId } });
      const module = await moduleRepo.findOne({ where: { id: moduleId } });
      if (!business || !module) return res.status(404).json({ message: 'İşletme veya modül bulunamadı' });
      const order = storeOrderRepo.create({ business, module, amount, status });
      await storeOrderRepo.save(order);
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { amount, status } = req.body;
    const order = await storeOrderRepo.findOne({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (amount !== undefined) order.amount = amount;
    if (status) order.status = status;
    await storeOrderRepo.save(order);
    res.json(order);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const order = await storeOrderRepo.findOne({ where: { id } });
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    await storeOrderRepo.remove(order);
    res.json({ message: 'Sipariş silindi' });
  }
} 