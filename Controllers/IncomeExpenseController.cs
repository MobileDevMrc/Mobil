using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;
using ModularSaaS.Middleware;
using System.Security.Claims;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/income-expenses")]
    [Authorize(Roles = "business_owner,business_user")]
    public class IncomeExpenseController : ControllerBase
    {
        private readonly AppDbContext _db;
        public IncomeExpenseController(AppDbContext db)
        {
            _db = db;
        }

        // Sadece modül aktifse erişim
        [HttpGet]
        [ModuleAccess("Income & Expense Management")]
        public async Task<IActionResult> GetAll()
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var list = await _db.IncomeExpenses
                .Where(x => x.BusinessId.ToString() == businessId)
                .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        [ModuleAccess("Income & Expense Management")]
        public async Task<IActionResult> Create([FromBody] IncomeExpense dto)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            dto.Id = Guid.NewGuid();
            dto.BusinessId = Guid.Parse(businessId);
            dto.UserId = Guid.Parse(userId);
            dto.CreatedAt = DateTime.UtcNow;
            _db.IncomeExpenses.Add(dto);
            await _db.SaveChangesAsync();
            return Ok(dto);
        }

        [HttpPut("{id}")]
        [ModuleAccess("Income & Expense Management")]
        public async Task<IActionResult> Update(Guid id, [FromBody] IncomeExpense updated)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var entity = await _db.IncomeExpenses.FirstOrDefaultAsync(x => x.Id == id && x.BusinessId.ToString() == businessId);
            if (entity == null) return NotFound();
            entity.Type = updated.Type;
            entity.Amount = updated.Amount;
            entity.Description = updated.Description;
            entity.Date = updated.Date;
            await _db.SaveChangesAsync();
            return Ok(entity);
        }

        [HttpDelete("{id}")]
        [ModuleAccess("Income & Expense Management")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var entity = await _db.IncomeExpenses.FirstOrDefaultAsync(x => x.Id == id && x.BusinessId.ToString() == businessId);
            if (entity == null) return NotFound();
            _db.IncomeExpenses.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
} 