using System;

namespace ModularSaaS.Entities
{
    public enum IncomeExpenseType
    {
        income,
        expense
    }

    public class IncomeExpense
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public Guid UserId { get; set; }
        public IncomeExpenseType Type { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Business Business { get; set; }
        public User User { get; set; }
    }
} 