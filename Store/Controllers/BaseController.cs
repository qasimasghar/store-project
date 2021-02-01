using Microsoft.AspNetCore.Mvc;
using Shop.Data;

namespace Shop.Controllers
{
    public abstract class BaseController : Controller
    {
        protected ApplicationDbContext DbContext;

        protected BaseController(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }
    }
}
