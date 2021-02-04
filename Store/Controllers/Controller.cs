using Microsoft.AspNetCore.Mvc;
using Shop.Data;

namespace Shop.Controllers
{
    public abstract class Controller : ControllerBase
    {
        protected ApplicationDbContext DbContext;

        protected Controller(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }
    }
}
