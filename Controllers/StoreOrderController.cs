using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;
using System.Security.Claims;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/store-orders")]
    [Authorize(Roles = "business_owner")]
    public class StoreOrderController : ControllerBase
    {
        private readonly AppDbContext _db;
        public StoreOrderController(AppDbContext db)
        {
            _db = db;
        }

        // İşletmenin yaptığı tüm store siparişleri
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var orders = await _db.StoreOrders
                .Include(o => o.Module)
                .Where(o => o.BusinessId.ToString() == businessId)
                .ToListAsync();
            return Ok(orders);
        }

        // Yeni modül satın al
        [HttpPost]
        public async Task<IActionResult> Purchase([FromBody] StoreOrderDto dto)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var module = await _db.Modules.FindAsync(dto.ModuleId);
            if (module == null) return NotFound("Module not found");
            var order = new StoreOrder
            {
                Id = Guid.NewGuid(),
                BusinessId = Guid.Parse(businessId),
                ModuleId = dto.ModuleId,
                Price = dto.Price ?? module.BasePrice,
                PurchasedAt = DateTime.UtcNow
            };
            _db.StoreOrders.Add(order);
            // Store'dan alınan modülü BusinessModules'a da ekle
            _db.BusinessModules.Add(new BusinessModule
            {
                Id = Guid.NewGuid(),
                BusinessId = order.BusinessId,
                ModuleId = order.ModuleId,
                IsActive = true,
                ActivatedAt = DateTime.UtcNow,
                Source = ModuleSource.store
            });
            await _db.SaveChangesAsync();
            return Ok(order);
        }
    }

    public class StoreOrderDto
    {
        public Guid ModuleId { get; set; }
        public decimal? Price { get; set; } // İsteğe bağlı, yoksa modülün base price'ı alınır
    }
} 