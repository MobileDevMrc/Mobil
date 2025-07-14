using System;

namespace ModularSaaS.Entities
{
    public class StoreOrder
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public Guid ModuleId { get; set; }
        public decimal Price { get; set; }
        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;

        public Business Business { get; set; }
        public Module Module { get; set; }
    }
} 