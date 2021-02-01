using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Shop.BindingModels
{
    public class PackageBindingModel
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public IEnumerable<string> Products { get; set; }

        public double Price { get; set; }
    }
}
