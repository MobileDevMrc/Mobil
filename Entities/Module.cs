using System;

namespace ModularSaaS.Entities
{
    public class Module
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public bool IsDefault { get; set; }
    }
} 