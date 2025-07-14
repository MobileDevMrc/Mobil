using System;

namespace ModularSaaS.Entities
{
    public enum UserRole
    {
        admin,
        business_owner,
        business_user
    }

    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Name { get; set; }
        public UserRole Role { get; set; }
        public Guid? BusinessId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Business Business { get; set; }
    }
} 