using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using ModularSaaS.Data;
using Microsoft.EntityFrameworkCore;

namespace ModularSaaS.Middleware
{
    public class ModuleAccessAttribute : Attribute, IAsyncActionFilter
    {
        private readonly string _moduleName;
        public ModuleAccessAttribute(string moduleName)
        {
            _moduleName = moduleName;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var user = context.HttpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var businessIdStr = user.Claims.FirstOrDefault(c => c.Type == "business_id")?.Value;
            if (string.IsNullOrEmpty(businessIdStr) || !Guid.TryParse(businessIdStr, out var businessId))
            {
                context.Result = new ForbidResult();
                return;
            }

            var db = context.HttpContext.RequestServices.GetService(typeof(AppDbContext)) as AppDbContext;
            var hasModule = await db.BusinessModules
                .Include(bm => bm.Module)
                .AnyAsync(bm => bm.BusinessId == businessId && bm.Module.Name == _moduleName && bm.IsActive);

            if (!hasModule)
            {
                context.Result = new ForbidResult();
                return;
            }

            await next();
        }
    }
} 