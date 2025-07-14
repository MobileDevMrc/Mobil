using Microsoft.AspNetCore.Mvc;
using ModularSaaS.Dtos;
using ModularSaaS.Entities;
using ModularSaaS.Data;
using BCrypt.Net;
using ModularSaaS.Utils;
using Microsoft.EntityFrameworkCore;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtHelper _jwtHelper;
        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _jwtHelper = new JwtHelper(config);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Name = dto.Name,
                Role = Enum.Parse<UserRole>(dto.Role),
                BusinessId = dto.BusinessId,
                CreatedAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok(new { user.Id, user.Email, user.Name, user.Role });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _jwtHelper.GenerateToken(user);
            return Ok(new { token });
        }
    }
} 