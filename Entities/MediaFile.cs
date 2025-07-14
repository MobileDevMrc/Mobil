using System;

namespace ModularSaaS.Entities
{
    public enum MediaType
    {
        photo,
        document
    }

    public class MediaFile
    {
        public Guid Id { get; set; }
        public Guid UploadedBy { get; set; }
        public Guid BusinessId { get; set; }
        public MediaType Type { get; set; }
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; }
        public Business Business { get; set; }
    }
} 