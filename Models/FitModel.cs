using System.ComponentModel.DataAnnotations;

namespace thursday9.Models
{
    public class FitModel
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Image { get; set; }
    }
}