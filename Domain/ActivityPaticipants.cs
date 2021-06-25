using Domain;
using System.Collections.Generic;
using System;

namespace Domain
{
    public class ActivityPaticipants
    {
        public Guid ActivityId { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public Activity Activity { get; set; }
        public bool IsHost { get; set; }
    }
}