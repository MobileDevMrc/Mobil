using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;
using System.Security.Claims;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/business-modules")]
    [Authorize(Roles = "business_owner")]
    public class BusinessModuleController : ControllerBase
    {
        private readonly AppDbContext _db;
        public BusinessModuleController(AppDbContext db)
        {
            _db = db;
        }

        // İşletmenin aktif modülleri
        [HttpGet]
        public async Task<IActionResult> GetMyModules()
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var modules = await _db.BusinessModules
                .Include(bm => bm.Module)
                .Where(bm => bm.BusinessId.ToString() == businessId && bm.IsActive)
                .Select(bm => bm.Module)
                .ToListAsync();
            return Ok(modules);
        }

        // İşletmeye yeni modül abonesi ekle (abonelik veya store)
        [HttpPost]
        public async Task<IActionResult> AddModule([FromBody] AddBusinessModuleDto dto)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            if (await _db.BusinessModules.AnyAsync(bm => bm.BusinessId.ToString() == businessId && bm.ModuleId == dto.ModuleId && bm.IsActive))
                return BadRequest("Module already active for this business");
            var businessModule = new BusinessModule
            {
                Id = Guid.NewGuid(),
                BusinessId = Guid.Parse(businessId),
                ModuleId = dto.ModuleId,
                IsActive = true,
                ActivatedAt = DateTime.UtcNow,
                Source = dto.Source
            };
            _db.BusinessModules.Add(businessModule);
            await _db.SaveChangesAsync();
            return Ok(businessModule);
        }

        // Modül aboneliğini iptal et (deactivate)
        [HttpDelete("{moduleId}")]
        public async Task<IActionResult> RemoveModule(Guid moduleId)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var businessModule = await _db.BusinessModules.FirstOrDefaultAsync(bm => bm.BusinessId.ToString() == businessId && bm.ModuleId == moduleId && bm.IsActive);
            if (businessModule == null) return NotFound();
            businessModule.IsActive = false;
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public class AddBusinessModuleDto
    {
        public Guid ModuleId { get; set; }
        public ModuleSource Source { get; set; } // subscription veya store
    }
} 