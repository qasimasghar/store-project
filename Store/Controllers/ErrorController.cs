using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Shop.Exceptions;

namespace Store.Controllers
{
    public class ErrorController : ControllerBase
    {
        [Route("Error")]
        public ActionResult Error()
        {
            var exception = HttpContext.Features.Get<IExceptionHandlerFeature>().Error;

            if (exception is InvalidCurrencyException || exception is InvalidProductsException)
            {
                return BadRequest();
            }

            return Problem();
        }
    }
}
