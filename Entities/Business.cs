using System;
using System.Collections.Generic;

namespace ModularSaaS.Entities
{
    public class Business
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Sector { get; set; }
        public Guid? OwnerId { get; set; }
        public DateTime? SubscriptionStart { get; set; }
        public DateTime? SubscriptionEnd { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<User> Users { get; set; }
        public ICollection<BusinessModule> BusinessModules { get; set; }
        public ICollection<StoreOrder> StoreOrders { get; set; }
        public ICollection<MediaFile> MediaFiles { get; set; }
        public ICollection<ActivityLog> ActivityLogs { get; set; }
        public ICollection<IncomeExpense> IncomeExpenses { get; set; }
    }
} 