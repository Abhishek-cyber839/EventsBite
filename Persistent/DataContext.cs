using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Persistent
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options): base(options){}
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityPaticipants> ActivitiesParticipants { get; set; }
        protected override void OnModelCreating(ModelBuilder builder){
            base.OnModelCreating(builder);
            builder.Entity<ActivityPaticipants>(x => x.HasKey(aa => new {aa.UserId,aa.ActivityId}));
            builder.Entity<ActivityPaticipants>().HasOne(u => u.User).WithMany(x => x.Activities).HasForeignKey(f => f.UserId);
            builder.Entity<ActivityPaticipants>().HasOne(u => u.Activity).WithMany(x => x.Participants).HasForeignKey(f => f.ActivityId);

        }
            
    }
}
