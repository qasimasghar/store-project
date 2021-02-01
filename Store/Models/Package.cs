using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Shop.Models
{
    public class Package
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Products { get; set; }

        public double UsdPrice { get; set; }
    }
}
