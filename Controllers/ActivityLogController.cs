using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/activity-logs")]
    [Authorize(Roles = "admin")]
    public class ActivityLogController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ActivityLogController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _db.ActivityLogs
                .Include(l => l.User)
                .Include(l => l.Business)
                .OrderByDescending(l => l.CreatedAt)
                .Take(100)
                .ToListAsync();
            return Ok(logs);
        }
    }
} 