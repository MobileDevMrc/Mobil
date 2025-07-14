# Node.js Modüler SaaS Backend

## Kurulum

1. Bağımlılıkları yükle:
   ```
   npm install
   ```
2. `.env` dosyasını oluşturup doldurun (örnek için `.env.example`'a bakın).
3. Veritabanınızı oluşturun ve ayarları .env'ye girin.
4. Geliştirme için:
   ```
   npm run dev
   ```
5. Derleyip başlatmak için:
   ```
   npm run build
   npm start
   ```
6. Seed data eklemek için:
   ```
   npm run seed
   ```

## Özellikler
- JWT ile kimlik doğrulama
- Rol ve modül bazlı erişim kontrolü
- PostgreSQL + TypeORM
- CRUD API'ler
- Seed data

## Notlar
- Docker kullanılmaz, doğrudan Node.js ile çalışır.
- PostgreSQL bağlantı bilgilerinizi .env dosyasına girin. 