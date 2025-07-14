using ModularSaaS.Entities;
using Microsoft.EntityFrameworkCore;

namespace ModularSaaS.Data.Seed
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext db)
        {
            if (await db.Users.AnyAsync()) return; // Zaten seed edilmişse tekrar ekleme

            // Modüller
            var modules = new List<Module>
            {
                new Module { Id = Guid.NewGuid(), Name = "Inventory Tracking", Description = "Stok takibi", BasePrice = 10, IsDefault = true },
                new Module { Id = Guid.NewGuid(), Name = "Income & Expense Management", Description = "Gelir/gider yönetimi", BasePrice = 15, IsDefault = true },
                new Module { Id = Guid.NewGuid(), Name = "Staff Management", Description = "Personel yönetimi", BasePrice = 12, IsDefault = false }
            };
            db.Modules.AddRange(modules);

            // Admin
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@platform.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Name = "Platform Admin",
                Role = UserRole.admin,
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(admin);

            // Business Owner ve Business
            var owner = new User
            {
                Id = Guid.NewGuid(),
                Email = "owner@company.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Owner123!"),
                Name = "Business Owner",
                Role = UserRole.business_owner,
                CreatedAt = DateTime.UtcNow
            };
            var business = new Business
            {
                Id = Guid.NewGuid(),
                Name = "Demo Company",
                Sector = "Retail",
                OwnerId = owner.Id,
                SubscriptionStart = DateTime.UtcNow,
                SubscriptionEnd = DateTime.UtcNow.AddYears(1),
                CreatedAt = DateTime.UtcNow
            };
            owner.BusinessId = business.Id;
            db.Users.Add(owner);
            db.Businesses.Add(business);

            // Business User
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "user@company.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                Name = "Business User",
                Role = UserRole.business_user,
                BusinessId = business.Id,
                CreatedAt = DateTime.UtcNow
            };
            db.Users.Add(user);

            // Business'ın default modülleri
            db.BusinessModules.Add(new BusinessModule
            {
                Id = Guid.NewGuid(),
                BusinessId = business.Id,
                ModuleId = modules[0].Id,
                IsActive = true,
                ActivatedAt = DateTime.UtcNow,
                Source = ModuleSource.subscription
            });
            db.BusinessModules.Add(new BusinessModule
            {
                Id = Guid.NewGuid(),
                BusinessId = business.Id,
                ModuleId = modules[1].Id,
                IsActive = true,
                ActivatedAt = DateTime.UtcNow,
                Source = ModuleSource.subscription
            });

            await db.SaveChangesAsync();
        }
    }
} 