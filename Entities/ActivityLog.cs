using System;

namespace ModularSaaS.Entities
{
    public class ActivityLog
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid BusinessId { get; set; }
        public string Action { get; set; }
        public string Metadata { get; set; } // JSON string
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; }
        public Business Business { get; set; }
    }
} 