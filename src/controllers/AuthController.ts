import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

const userRepo = AppDataSource.getRepository(User);

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Eksik bilgi' });
      }
      const existing = await userRepo.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: 'Bu email zaten kayıtlı' });
      }
      const passwordHash = await hashPassword(password);
      const user = userRepo.create({ email, passwordHash, name, role: role || UserRole.USER });
      await userRepo.save(user);
      return res.status(201).json({ message: 'Kayıt başarılı' });
    } catch (err) {
      return res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Eksik bilgi' });
      }
      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
      }
      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: 'Şifre hatalı' });
      }
      const token = generateToken({ id: user.id, email: user.email, role: user.role });
      return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
      return res.status(500).json({ message: 'Sunucu hatası', error: err });
    }
  }
} 