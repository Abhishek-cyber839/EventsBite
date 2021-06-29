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
        public DbSet<Photo> Photos{ get; set; }
        public DbSet<Comment> Comments{ get; set; }
        public DbSet<UserFollowing> UserFollowings{ get; set; }

        protected override void OnModelCreating(ModelBuilder builder){
            base.OnModelCreating(builder);
            builder.Entity<ActivityPaticipants>(x => x.HasKey(aa => new {aa.UserId,aa.ActivityId}));
            builder.Entity<ActivityPaticipants>().HasOne(u => u.User).WithMany(x => x.Activities).HasForeignKey(f => f.UserId);
            builder.Entity<ActivityPaticipants>().HasOne(u => u.Activity).WithMany(x => x.Participants).HasForeignKey(f => f.ActivityId);
            builder.Entity<Comment>().HasOne(comment => comment.Activity).WithMany(activity => activity.Comments).OnDelete(DeleteBehavior.Cascade);
            // OnDelete(DeleteBehavior.Cascade) will delete all the comments associated with that activity when that activity gets deleted.
            builder.Entity<UserFollowing>(user => {
                user.HasKey(k => new {k.ObserverId,k.TargetId});

                user.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);
                // Delete all the followings and followings associated with that user when that user gets deleted.

                 user.HasOne(o => o.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(o => o.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);
                // Delete all the followers and followings associated with that user when that user gets deleted.
            });
        } 
    }
}
