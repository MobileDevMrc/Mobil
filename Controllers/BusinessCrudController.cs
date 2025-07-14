using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;
using System.Security.Claims;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/businesses")]
    [Authorize(Roles = "admin,business_owner")]
    public class BusinessCrudController : ControllerBase
    {
        private readonly AppDbContext _db;
        public BusinessCrudController(AppDbContext db)
        {
            _db = db;
        }

        // Admin: tüm işletmeleri görebilir, Owner: sadece kendi işletmesini görebilir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userBusinessId = User.FindFirst("business_id")?.Value;
            if (userRole == "admin")
                return Ok(await _db.Businesses.ToListAsync());
            else
                return Ok(await _db.Businesses.Where(b => b.Id.ToString() == userBusinessId).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userBusinessId = User.FindFirst("business_id")?.Value;
            if (userRole != "admin" && userBusinessId != id.ToString())
                return Forbid();
            var business = await _db.Businesses.FindAsync(id);
            if (business == null) return NotFound();
            return Ok(business);
        }

        // Sadece admin yeni işletme ekleyebilir
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create(Business business)
        {
            business.Id = Guid.NewGuid();
            business.CreatedAt = DateTime.UtcNow;
            _db.Businesses.Add(business);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = business.Id }, business);
        }

        // Admin veya owner kendi işletmesini güncelleyebilir
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, Business updated)
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userBusinessId = User.FindFirst("business_id")?.Value;
            if (userRole != "admin" && userBusinessId != id.ToString())
                return Forbid();
            var business = await _db.Businesses.FindAsync(id);
            if (business == null) return NotFound();
            business.Name = updated.Name;
            business.Sector = updated.Sector;
            business.SubscriptionStart = updated.SubscriptionStart;
            business.SubscriptionEnd = updated.SubscriptionEnd;
            await _db.SaveChangesAsync();
            return Ok(business);
        }

        // Sadece admin silebilir
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var business = await _db.Businesses.FindAsync(id);
            if (business == null) return NotFound();
            _db.Businesses.Remove(business);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
} 