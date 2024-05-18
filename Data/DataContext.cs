using Microsoft.EntityFrameworkCore;

namespace thursday9.Data
{
    public class DataContext: DbContext
    {
        public DataContext (DbContextOptions options): base(options)
        {

        }

        public DbSet<thursday9.Models.FitModel> DataFit { get; set; }
    }
}