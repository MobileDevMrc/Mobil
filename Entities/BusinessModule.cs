using System;

namespace ModularSaaS.Entities
{
    public enum ModuleSource
    {
        subscription,
        store
    }

    public class BusinessModule
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public Guid ModuleId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime ActivatedAt { get; set; } = DateTime.UtcNow;
        public ModuleSource Source { get; set; }

        public Business Business { get; set; }
        public Module Module { get; set; }
    }
} 