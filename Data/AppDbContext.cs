using Microsoft.EntityFrameworkCore;
using ModularSaaS.Entities;

namespace ModularSaaS.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Business> Businesses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<BusinessModule> BusinessModules { get; set; }
        public DbSet<StoreOrder> StoreOrders { get; set; }
        public DbSet<MediaFile> MediaFiles { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<IncomeExpense> IncomeExpenses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Enumları string olarak sakla
            modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
            modelBuilder.Entity<BusinessModule>().Property(bm => bm.Source).HasConversion<string>();
            modelBuilder.Entity<MediaFile>().Property(mf => mf.Type).HasConversion<string>();
            modelBuilder.Entity<IncomeExpense>().Property(ie => ie.Type).HasConversion<string>();
        }
    }
} 