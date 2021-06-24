using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistent
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options): base(options){}
         public DbSet<Activity> Activities { get; set; }
    }
}
