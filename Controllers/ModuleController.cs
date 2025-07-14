using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ModularSaaS.Data;
using ModularSaaS.Entities;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/modules")]
    [Authorize(Roles = "admin")]
    public class ModuleController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ModuleController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var modules = await _db.Modules.ToListAsync();
            return Ok(modules);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var module = await _db.Modules.FindAsync(id);
            if (module == null) return NotFound();
            return Ok(module);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Module module)
        {
            module.Id = Guid.NewGuid();
            _db.Modules.Add(module);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = module.Id }, module);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, Module updated)
        {
            var module = await _db.Modules.FindAsync(id);
            if (module == null) return NotFound();
            module.Name = updated.Name;
            module.Description = updated.Description;
            module.BasePrice = updated.BasePrice;
            module.IsDefault = updated.IsDefault;
            await _db.SaveChangesAsync();
            return Ok(module);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var module = await _db.Modules.FindAsync(id);
            if (module == null) return NotFound();
            _db.Modules.Remove(module);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
} 