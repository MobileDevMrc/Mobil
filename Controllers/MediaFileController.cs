using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;
using System.Security.Claims;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/media-files")]
    [Authorize(Roles = "business_owner,business_user")]
    public class MediaFileController : ControllerBase
    {
        private readonly AppDbContext _db;
        public MediaFileController(AppDbContext db)
        {
            _db = db;
        }

        // İşletmenin tüm medya dosyalarını getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var files = await _db.MediaFiles
                .Where(f => f.BusinessId.ToString() == businessId)
                .ToListAsync();
            return Ok(files);
        }

        // Dosya yükleme (şimdilik sadece url ve tip alır, gerçek upload için storage entegrasyonu gerekir)
        [HttpPost]
        public async Task<IActionResult> Upload([FromBody] MediaFileUploadDto dto)
        {
            var businessId = User.FindFirst("business_id")?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            var file = new MediaFile
            {
                Id = Guid.NewGuid(),
                UploadedBy = Guid.Parse(userId),
                BusinessId = Guid.Parse(businessId),
                Type = dto.Type,
                Url = dto.Url, // Gerçek dosya yükleme için storage entegrasyonu gerekir
                CreatedAt = DateTime.UtcNow
            };
            _db.MediaFiles.Add(file);
            await _db.SaveChangesAsync();
            return Ok(file);
        }
    }

    public class MediaFileUploadDto
    {
        public MediaType Type { get; set; }
        public string Url { get; set; } // Gerçek upload için dosya upload endpointi gerekir
    }
} 