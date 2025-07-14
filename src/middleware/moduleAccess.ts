import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

// Not: Gerçek uygulamada, kullanıcının erişebileceği modüller veritabanından kontrol edilmeli.
export function authorizeModuleAccess(moduleName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.modules || !req.user.modules.includes(moduleName)) {
      return res.status(403).json({ message: 'Modül erişimi yok' });
    }
    next();
  };
} 