using Microsoft.AspNetCore.Identity;
using Domain;
using System.Collections.Generic;

namespace Domain
{
    public class User:IdentityUser
    {
        public string DisplayName{get; set;}
        public string Bio{get; set;}
        public ICollection<ActivityPaticipants> Activities { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<UserFollowing> Followers { get; set; }
        public ICollection<UserFollowing> Followings { get; set; }

    }
}