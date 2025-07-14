using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModularSaaS.Middleware;

namespace ModularSaaS.Controllers
{
    [ApiController]
    [Route("api/business")]
    public class BusinessController : ControllerBase
    {
        // Sadece Business Owner erişebilir
        [HttpGet("dashboard")]
        [Authorize(Roles = "business_owner")]
        public IActionResult OwnerDashboard()
        {
            return Ok("Business Owner dashboard erişimi başarılı!");
        }

        // Sadece Business User erişebilir, ayrıca 'Income & Expense Management' modülü aktif olmalı
        [HttpGet("income-expense")]
        [Authorize(Roles = "business_user")]
        [ModuleAccess("Income & Expense Management")]
        public IActionResult IncomeExpenseModule()
        {
            return Ok("Business User, Income & Expense Management modülüne erişti!");
        }
    }
} 